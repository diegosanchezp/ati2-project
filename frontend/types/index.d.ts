import type { NextPage, GetServerSidePropsContext } from 'next';
import type {Session} from "auth";

export type PageWithSession<T={}> = NextPage<T &
  {
    session: Session,
    locales: GetServerSidePropsContext["locales"]
  }
>

type errorMsg = {
    message: string,
    code: string,
};

type formError = {
  [key: string]: errorMsg[]
}
