import type { NextPage } from 'next';
import type {Session} from "auth";

export type PageWithSession<T={}> = NextPage<T & {session: Session}>
