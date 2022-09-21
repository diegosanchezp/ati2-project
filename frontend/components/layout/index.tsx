import React from "react";
import Link from 'next/link';
import {useRouter} from "next/router";
import {djRequest} from "utils/apirest";
import { Container, Header, Content, Navbar, Nav, Button } from 'rsuite';
import {routes} from "utils/routes";
import {useSession} from "auth";

export type LayoutProps = {
  children: React.ReactNode
}

export function Layout(props: LayoutProps){
  const {children} = props;
  const {session, dispatch} = useSession();
  const router = useRouter();

  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Nav>
            <Nav.Item>Inicio</Nav.Item>
            <Nav.Item>Vehículos</Nav.Item>
            <Nav.Item>Servicios</Nav.Item>
            <Nav.Item>Empleo</Nav.Item>
            <Nav.Item>Ayuda</Nav.Item>
            <Nav.Item>Contáctenos</Nav.Item>
            <Nav.Item>Conócenos más</Nav.Item>
            <Nav.Item>Idioma</Nav.Item>
          </Nav>

          <Nav pullRight>
            {session.user ?
            <Nav.Menu title="Usuario">
              <Nav.Item>Datos de usuario</Nav.Item>
              <Nav.Item
                onClick={async ()=>{
                  await djRequest("logout");
                  dispatch({type: "setUser", user: null });
                  router.push(routes.login);
                }}
              >
                Cerrar sesión
              </Nav.Item>
            </Nav.Menu>
            :
            <>
              <Link href={routes.login}>
                <Nav.Item>
                  <Button color="orange" appearance="primary">Iniciar sessión</Button>
                </Nav.Item>
              </Link>
              <Nav.Item>
                <Button color="orange" appearance="primary">Registrarse</Button>
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
