import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nextRequest } from "utils/apirest";
import { useSession } from "auth";
import { withTranslations } from "utils/i18n";

import { routes } from "utils/routes";
import { useTranslations } from "next-intl";
import type { UserSerializer as User } from "djtypes/auth";
import type { errorMsg, formError } from "types";
import {
  Form,
  FlexboxGrid,
  ButtonToolbar,
  Panel,
  Button,
  Message,
  useToaster,
} from "rsuite";
import Link from "next/link";

const LoginPage: NextPage = () => {
  const { dispatch, session } = useSession();
  const router = useRouter();

  const t = useTranslations("LoginPage");

  console.log(session);
  const toaster = useToaster();
  const toasterPlacement = {
    placement: "bottomCenter",
  };

  async function login(
    checkStatus: boolean,
    e: React.FormEvent<HTMLFormElement>
  ) {
    const formData = new FormData(e.target as HTMLFormElement);

    const res = await nextRequest("auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!res.ok) {
      // TODO: Render on view Could not login message
      const errors: formError = await res.json();
      errors["__all__"].forEach((err) => {
        toaster.push(
          <Message duration={6000} closable type="error">
            {err.message}
          </Message>,
          toasterPlacement
        );
      });
      return;
    }
    const user: User = await res.json();
    console.log(user);

    toaster.push(
      <Message duration={6000} closable type="success">
        {t("welcomeBack")} {user?.last_name || user?.username}
      </Message>,
      toasterPlacement
    );
    dispatch({ type: "setUser", user: user });
    // SPA like route change
    router.push(routes.home);
  }

  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Login</h3>} bordered>
          <Form fluid onSubmit={login}>
            <Form.Group>
              <Form.ControlLabel>{t("emailField")}</Form.ControlLabel>
              <Form.Control
                name="email"
                placeholder="example@mail.com"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>{t("passWordField")}</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                placeholder="password"
                required
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  {t("logIn")}
                </Button>
                <Link href={routes.recoverPassword}>
                  <a>
                    <Button appearance="link">{t("forgotPass")}</Button>
                  </a>
                </Link>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default LoginPage;

export const getServerSideProps = withTranslations({
  folderPath: "auth",
});
