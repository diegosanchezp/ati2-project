import React from "react";
import type { NextPage } from 'next';

import {withTranslations} from "utils/i18n";

import {djRequest, getCSRF} from "utils/apirest";
import {useTranslations} from 'next-intl';

import {
  Form, FlexboxGrid, ButtonToolbar, Panel,
  Button, Message, useToaster,
} from "rsuite";

const RecoverPasswordPage: NextPage = (props) => {
  const [pageState, setPageState] = React.useState("");
  const t = useTranslations('RecoverPasswordPage');
  const toaster = useToaster();

  const toastOptions = {
    placement: "bottomCenter"
  }

  const handleSubmit = async (checkStatus: boolean, e: React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData(e.target as HTMLFormElement);
    const {csrfRes, csrfToken} = await getCSRF();
    if(!csrfRes.ok){
      console.error("Can't get csrf token");
      return
    }

    const res = await djRequest("password_change/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken as string,
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if(!res.ok){
      const error = await res.json();
      toaster.push(
        <Message type="error">

        </Message>,
        {...toastOptions}
      );
      return
    }

    toaster.push(
      <Message type="success" duration={10000}>
        Password recovery email sent to {formData.get("email")}

      </Message>,
      {...toastOptions}
    );
    setPageState("emailSent");

  }
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>{t('recoverPassword')}</h3>} bordered>
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>{t('emailField')}</Form.ControlLabel>
              <Form.Control name="email" type="email" placeholder="example@mail.com" required disabled={pageState === "emailSent"}/>
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit" disabled={pageState === "emailSent"}>{t('recoverBtn')}</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default RecoverPasswordPage

export const getServerSideProps = withTranslations({
  folderPath: "auth"
});
