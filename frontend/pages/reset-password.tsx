import React from "react";
import type { NextPage, GetServerSideProps } from 'next';
import {splitCookiesString} from "auth";
import {djRequest, getCSRF} from "utils/apirest";

import type {formError} from "types"

import {
  Form, FlexboxGrid, ButtonToolbar, Panel,
  Button, Message, useToaster,
} from "rsuite";

const reset_url_token = "set-password"

type SetNewPasswordPageProps = {
  uidb64: string
}

const SetNewPasswordPage: NextPage<SetNewPasswordPageProps> = (props) => {
  const {uidb64} = props;

  const [errorMessages, setErrorMessage] = React.useState<formError>({});
  const toaster = useToaster();

  const toastOptions = {
    placement: "bottomCenter"
  }
  const handleSubmit = async (checkStatus: boolean, e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage({
    });
    const formData = new FormData(e.target as HTMLFormElement);
    const {csrfToken} = await getCSRF();
    const res = await djRequest(`reset/${uidb64}/${reset_url_token}/`,{
      method: "POST",
      headers: {
        'X-CSRFToken': csrfToken as string,
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if(!res.ok){
      // Message
      const errors: formError = await res.json();
      setErrorMessage(errors);
      return
    }
    
    // Password changed
    toaster.push(
      <Message type="success" duration={10000}>
        Password changed
      </Message>,
      {...toastOptions}
    );

    // Do redirect ?
  }

  return (

    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Enter new password</h3>} bordered>
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>New Password</Form.ControlLabel>
              <Form.Control
                name="new_password1"
                type="password"
                placeholder="password"
                required
                errorMessage={
                  errorMessages["new_password1"] ?
                  errorMessages["new_password1"][0].message
                  : null
                }/>
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Confirm Password</Form.ControlLabel>
              <Form.Control
                name="new_password2"
                type="password"
                placeholder="password"
                required
                errorMessage={
                  errorMessages["new_password2"] ?
                  errorMessages["new_password2"][0].message
                  : null
                }/>
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">Change my password</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}

// http://localhost:3000/reset-password?uidb64=MQ&token=bd17gt-f4349e62a5a2151790c77303702c51ac

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query, res} = context;
  const {uidb64,token} = query;

  if(!uidb64 || !token){
    return {
      notFound: true,
    }
  }

  const djres = await djRequest(`reset/${uidb64}/${token}/`,{
     method: "POST",
  });

  if(!djres.ok){
    return {
      props: {
        error: "invalid brah"
      }
    }

  }

  // Foward headers
  res.setHeader("set-cookie",splitCookiesString(djres.headers.get("set-cookie") as string));

  return {
    props: {
      uidb64: uidb64,
    },
  }
}

export default SetNewPasswordPage;
