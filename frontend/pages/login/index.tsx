import type { NextPage } from 'next';
import {useRouter} from "next/router";
import {nextRequest} from "utils/apirest";
import {useSession} from "auth";



const LoginPage: NextPage = () => {
  const {session, dispatch} = useSession();
  const router = useRouter();
  console.log(session);

  async function login(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await nextRequest("auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData))
    });

    console.log(res);
    if(!res.ok){
      // TODO: Render on view Could not login message
      const errors = await res.json();
      console.log(errors)
      return 
    }
    const user = await res.json();
    dispatch({type: "setUser",user: user })
    // SPA like route change
    router.push("/");
  }

  return (
    <form onSubmit={login} action="/">
      <input type="text" placeholder="username" name="username" required />
      <input type="password" placeholder="password" name='password' required />
      <button type="submit">login</button>
    </form>
  );
};

export default LoginPage;
export const getServerSideProps = () => {
  return {
    props: {
      test: "test",
    }
  }
}
