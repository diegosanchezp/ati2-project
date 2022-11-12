import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest } from 'next'

import {UserSerializer as User} from "djtypes/auth";
import {getTransMessages} from "utils/i18n";
import {createRequester, djRequest} from "utils/apirest";
import {splitCookiesString} from "./cookies";

// serversideprops fetch client

export type Session = {
  user: User,
};
const client = async (context: GetServerSidePropsContext) => {

  let csrfCookie = splitCookiesString(context.req.headers.cookie as string);
  let csrfToken  = context.req.cookies.csrftoken;

  if(!csrfCookie){
    // get csrf token
    const csrfres = await fetch("http://localhost:8000/api/csrf/");
     csrfCookie = splitCookiesString(csrfres.headers.get("set-cookie") as string);

    if(!csrfToken){
      csrfToken = csrfres.headers.get("X-CSRFToken") as string;
    }
  }

  return createRequester("http://localhost:8000", {
    headers: {
      "X-CSRFToken": csrfToken as string,
      "Cookie": csrfCookie as string
    }
  });
}

// get logged in user
// meant to be used in get serverside props
export const getSession = async (req: GetServerSidePropsContext["req"] | NextApiRequest)=> {

  const {sessionid, csrftoken} = req.cookies;
  // No session we are not logged in
  if(!sessionid){
    return
  }

  // Get user with the session cookies
  const whoRes = await djRequest("whoami", {
    headers: {
      "Cookie": `sessionid=${sessionid}; csrftoken=${csrftoken}`
    }
  });

  if(!whoRes.ok){return}
  const user: User = await whoRes.json();

  return {
    user: user,
  } as Session;
}

type SSPandSession = GetServerSidePropsContext & {
  djRequest: any
  user: any
};

export type AuthRequiredParams<P> = {
  redirect?: string,
  getServerSideProps?: (context: SSPandSession) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
  i18nFolder?: string,
}


export function withAuth<P>(params: AuthRequiredParams<P>){
  const {redirect, getServerSideProps, i18nFolder} = params;

  return async function decoratedFn(context: GetServerSidePropsContext){
    const session = await getSession(context.req);

    // If the user is not authenticated redirect to
    // login page
    if(!session){
      return {
        redirect: {
          destination: redirect || '/login',
          permanent: false,
        }
      } as GetServerSidePropsResult<P>
    }

    // Axios client with Auth header
    if (getServerSideProps){
      const pageProps = await getServerSideProps(
        {
          ...context,
          ...session,
          djRequest: await client(context), // this probably has to change
        }
      );

      const {props, ...restPageProps} = pageProps;
      const propsResults = {
        props: {
          locales: context.locales,
          messages: await getTransMessages({
            locale: context.locale,
            folderPath: i18nFolder,
          }),
          ...props,
          session: session,
        },
        ...restPageProps,
      } as GetServerSidePropsResult<P>
      return propsResults;
    }else{
      return {
        props: {}
      } as GetServerSidePropsResult<P>
    }
  }
}
