import React from 'react'
import type {Session} from "auth";
import {nextRequest} from "utils/apirest";

import {UserSerializer as User} from "djtypes/auth";


type Action = {type: 'setUser', user: User | null}
type Dispatch = (action: Action) => void
type State = {user: User | null  } // Todo change this type
type SessionProviderProps = {children: React.ReactNode,  session?: Session}

const SessionStateContext = React.createContext<
  {session: State; dispatch: Dispatch} | undefined
>(undefined)

function sessionReducer(prevState: State, action: Action): State {
  switch (action.type) {
    // used for loggin in and out
    case 'setUser': {
      return {...prevState, user: action.user}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function SessionProvider({children, session}: SessionProviderProps) {
  const [state, dispatch] = React.useReducer(sessionReducer, {user: session?.user ?? null});
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {session: state, dispatch}
  React.useEffect(()=>{
    if(!session){
      (async()=>{
        const res = await nextRequest("auth/getSession");
        const resSession: Session | null = await res.json();
        if(resSession){
          dispatch({type: "setUser", user: resSession.user});
        }
      })();
    }
  },[])

  return (
    <SessionStateContext.Provider value={value}>
      {children}
    </SessionStateContext.Provider>
  )
}

function useSession() {
  const context = React.useContext(SessionStateContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export {SessionProvider, useSession}
