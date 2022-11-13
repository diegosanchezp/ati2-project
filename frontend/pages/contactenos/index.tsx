import React from "react";

import {withTranslations} from "utils/i18n";
import {useTranslations} from 'next-intl';

import { Modal, Button, ButtonToolbar, Grid, Row, Col, Form, Panel, FlexboxGrid, useToaster, Message } from 'rsuite';

import type { NextPage } from 'next';
import {Textarea} from "components/form";
import { djRequest } from "utils/apirest";

type InfoSectionProps = {
  title: string
  children: React.ReactNode
  listStyleType?: string
}

function InfoSection(props: InfoSectionProps){

  const {children, title, listStyleType = "none"} = props;

  return (
    <>
      <h3>{title}</h3>
      <ul style={{listStyleType: listStyleType }}>
        {children}
      </ul>
    </>
  );
}

const ContactPage: NextPage = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toaster = useToaster();

  const toasterPlacement = {
    placement: "bottomCenter",
  }
  // const t = useTranslations('LoginPage');
  async function sendContactEmail(checkStatus: boolean, e: React.FormEvent<HTMLFormElement>){
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await djRequest("email/send_mail", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if(!res.ok){
      const errors = await res.json()
      console.log(errors)

    }

    toaster.push(
      <Message duration={6000} closable type="success">
        ¡Email enviado!
      </Message>,
      toasterPlacement,
    )


  }

  return (
    <Grid>
      <Row style={{margin: "1em"}}>
        <Col xs={12}>
          <InfoSection title="Teléfonos">
            <li>+58 (0212)-362-82-68</li>
            <li>+58+0414-389-74-44</li>
          </InfoSection>

          <InfoSection title="Atención al público">
            <li><b>Lunes a Viernes</b>: De 8 am a 12 m. Y de 1pm a 5pm</li>
            <li><b>Sábados y Domingo</b>: De 8 am a 12 m. Y de 1pm a 5pm</li>
          </InfoSection>

          <InfoSection title="Correo electrónico">
            <li>Envíanos tus preguntas o comentarios a 
  nirvana01@gmail.com</li>
          </InfoSection>

          <InfoSection
            title="Enlaces de interés"
            listStyleType="disc"
          >
            <li><a onClick={handleOpen}>Preguntas Frecuentes</a></li>
            <li><a>Términos de servicio</a></li>
          </InfoSection>
        </Col>

        <Col xs={12}>
          <ButtonToolbar>
            <Button onClick={handleOpen}>Preguntas frecuentes</Button>
          </ButtonToolbar>

          <Modal open={open} onClose={handleClose}>
            <Modal.Header>
              <Modal.Title>Preguntas frecuentes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿ Pregunta 1 ?</p>
              <ul>
                <li>Respuesta1 a la pregunta 1</li>
              </ul>
              <p>¿ Pregunta 2 ?</p>
              <ul>
                <li>Respuesta1 a la pregunta 2</li>
                <li>Respuesta2 a la pregunta 2</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose} appearance="primary">
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
          <Panel
            header={<h3>Formulario de contacto</h3>}
            bordered
            style={{
              marginTop: "1em"
            }}
          >
            <Form fluid onSubmit={sendContactEmail} >
              <Form.Group controlId="to_mail">
                <Form.ControlLabel>Para</Form.ControlLabel>
                <Form.Control type="email" name="to_mail" required />
              </Form.Group>
              <Form.Group controlId="firstname_lastname">
                <Form.ControlLabel>Nombre y apellido</Form.ControlLabel>
                <Form.Control type="text" name="firstname_lastname" required />
              </Form.Group>
              <Form.Group controlId="body">
                <Form.ControlLabel>Asunto</Form.ControlLabel>
                <Form.Control rows={5} accepter={Textarea} type="text" name="message" required />
              </Form.Group>
              <Form.Group>
                <FlexboxGrid justify="center">

                  <Button appearance="primary" type="submit">Enviar</Button>
                </FlexboxGrid>
              </Form.Group>
            </Form>
          </Panel>
        </Col>
      </Row>
    </Grid>
  );
}

export default ContactPage;

export const getServerSideProps = withTranslations({
});


