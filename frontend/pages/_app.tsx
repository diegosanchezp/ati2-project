import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import {Session, SessionProvider} from "auth";
import '../styles/global.less';
import {Layout} from "components/layout";
import { CustomProvider } from 'rsuite';
import {NextIntlProvider} from 'next-intl';

interface MyAppProps extends AppProps {
  pageProps: AppProps["pageProps"] & {
    session?: Session,
  }
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  return (
     <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider session={pageProps?.session}>
        <CustomProvider theme="dark" >
            <NextIntlProvider messages={pageProps.messages}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </NextIntlProvider>
        </CustomProvider>
      </SessionProvider>
    </>
  );
}
