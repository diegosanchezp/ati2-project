import type { NextPage } from 'next';
import {useRouter} from "next/router";
import {nextRequest} from "utils/apirest";
import {useSession} from "auth";
import {routes} from "utils/routes";

import {Form, FlexboxGrid, ButtonToolbar, Panel, Button} from "rsuite";


const LoginPage: NextPage = () => {
  const {session, dispatch} = useSession();
  const router = useRouter();
  console.log(session);

  async function login(checkStatus: boolean, e: React.FormEvent<HTMLFormElement>){
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
    router.push(routes.home);
  }

  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Login</h3>} bordered>
          <Form fluid onSubmit={login}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control name="email" placeholder="example@mail.com" required/>
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" type="password" placeholder="password" required />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">Sign in</Button>
                <Button appearance="link">Forgot password?</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
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
