import * as path from 'path';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type getTransMessagesParams = {
  folderPath?: string
  locale?: string
}

// Helper function
export async function getTransMessages(params: getTransMessagesParams){
  const {folderPath = "", locale} = params;

  const globalMessages = (
    await import(`../translations/${locale}.json`)
  ).default
  console.log(folderPath);
  const messages = (
    folderPath ? await import(`../translations/${folderPath}/${locale}.json`) : await import(`../translations/${locale}.json`)
  ).default

  return {...globalMessages, ...messages};
}

export type withTranslationsParams<P> = {
  getServerSideProps?: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
  folderPath?: string
}

// This is a serverside function
export function withTranslations<P>(params: withTranslationsParams<P>){


  const {getServerSideProps, folderPath} = params;

  return async function decoratedFn(context: GetServerSidePropsContext) {

    const defaultPageProps = {
      messages: await getTransMessages({
        locale: context.locale,
        folderPath: folderPath
      }),
    }

    if (!getServerSideProps){
      return {
        props: defaultPageProps,
      } as GetServerSidePropsResult<P>
    }

    const {props, ...restProps} = await getServerSideProps(context);

    return {
      ...restProps,
      props: {
        ...defaultPageProps,
        ...props,
      }
    }
  }
}
