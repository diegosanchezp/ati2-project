import React from "react";
import {useRouter} from "next/router";
import {djRequest} from "utils/apirest";
import { Container, Header, Content, Navbar, Nav, Button } from 'rsuite';
import {routes} from "utils/routes";
import {useSession} from "auth";

import {useTranslations} from 'next-intl';

import {NavLink} from "components/NavLink";
import { Dropdown } from 'rsuite';
export type LayoutProps = {
  children: React.ReactNode
}

export function Layout(props: LayoutProps){
  const {children} = props;
  const {session, dispatch} = useSession();
  const router = useRouter();

  const t = useTranslations('NavHeader');

  function switchLocale(eventKey: string){
    router.push(router.route, router.route, {locale: eventKey})
  }

  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Nav>
            <Nav.Item as={NavLink} href={routes.home}>{t('inicio')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('vehiculos')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('servicios')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('empleo')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('ayuda')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('contactenos')}</Nav.Item>
            <Nav.Item as={NavLink} href="">{t('conocenosMas')}</Nav.Item>
            <Dropdown title={t('idioma')} placement="bottomEnd" trigger={['click', 'hover']} >
              <Dropdown.Item eventKey="es" onSelect={switchLocale}>
                Español
              </Dropdown.Item>
              <Dropdown.Item eventKey="en" onSelect={switchLocale}>
                English
              </Dropdown.Item>
            </Dropdown>
          </Nav>

          <Nav pullRight>
            {session.user ?
            <Nav.Menu title={t('usuarioNavTitle')} placement="bottomEnd" trigger="hover">
              <Nav.Item>{t('datosUsuario')}</Nav.Item>
              <Nav.Item
                onClick={async ()=>{
                  await djRequest("logout");
                  dispatch({type: "setUser", user: null });
                  router.push(routes.login);
                }}
              >
                {t('cerrarSession')}
              </Nav.Item>
            </Nav.Menu>
            :
            <>
              <Nav.Item as={NavLink} href={routes.login}>
                <Button color="orange" appearance="primary">{t('iniciarSession')}</Button>
              </Nav.Item>
              <Nav.Item>
                <Button color="orange" appearance="primary">{t('register')}</Button>
              </Nav.Item>
            </>
          }
        </Nav>
        </Navbar>
      </Header>
      <Content className="">{children}</Content>
    </Container>
  );
}
