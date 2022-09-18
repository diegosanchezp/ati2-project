import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import {createRequester, fRequest} from "utils/apirest";
import {splitCookiesString} from "./cookies";

// serversideprops fetch client

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
const getSession = async (context: GetServerSidePropsContext)=> {

  console.log(context.req.cookies);
  const {sessionid, csrftoken} = context.req.cookies;
  // No session we are not logged in
  if(!sessionid){
    return
  }

  // Get user with the session cookies
  const whoRes = await fRequest("whoami", {
    headers: {
      "Cookie": `sessionid=${sessionid}; csrftoken=${csrftoken}`
    }
  });

  if(!whoRes.ok){return}
  const user = await whoRes.json();

  return {
    user: user,
  };
}

type SSPandSession = GetServerSidePropsContext & {
  fRequest: any
  user: any
};

export type AuthRequiredParams<P> = {
  redirect?: string,
  getServerSideProps?: (context: SSPandSession) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
}

export function withAuth<P>(params: AuthRequiredParams<P>){
  const {redirect, getServerSideProps} = params;

  return async function decoratedFn(context: GetServerSidePropsContext){
    const session = await getSession(context);

    // If the user is not authenticated redirect to
    // login page
    if(!session){
      return {
        redirect: {
          destination: redirect || '/',
          permanent: false,
        }
      } as GetServerSidePropsResult<P>
    }

    // Axios client with Auth header
    if (getServerSideProps){
      return getServerSideProps(
        {
          ...context,
          ...session,
          fRequest: await client(context), // this probably has to change
        }
      );
    }else{
      return {
        props: {}
      } as GetServerSidePropsResult<P>
    }
  }
}
