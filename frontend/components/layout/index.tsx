import React from "react";
import Link from 'next/link';
import {useRouter} from "next/router";
import {djRequest} from "utils/apirest";
import { Container, Header, Content, Navbar, Nav, Button } from 'rsuite';
import {routes} from "utils/routes";
import {useSession} from "auth";
import {NavLink} from "components/NavLink";
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
            <Nav.Item as={NavLink} href={routes.home}>Inicio</Nav.Item>
            <Nav.Item as={NavLink} href="">Vehículos</Nav.Item>
            <Nav.Item as={NavLink} href="">Servicios</Nav.Item>
            <Nav.Item as={NavLink} href="">Empleo</Nav.Item>
            <Nav.Item as={NavLink} href="">Ayuda</Nav.Item>
            <Nav.Item as={NavLink} href="">Contáctenos</Nav.Item>
            <Nav.Item as={NavLink} href="">Conócenos más</Nav.Item>
            <Nav.Item as={NavLink} href="">Idioma</Nav.Item>
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
              <Nav.Item as={NavLink} href={routes.login}>
                <Button color="orange" appearance="primary">Iniciar sessión</Button>
              </Nav.Item>
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
