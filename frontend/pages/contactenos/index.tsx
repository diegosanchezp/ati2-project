import React from "react";

import {withTranslations} from "utils/i18n";
import {useTranslations} from 'next-intl';
import {FaSvgIcon} from "components/FaSvgIcon";
import { Modal, Button, ButtonToolbar, Grid, Row, Col, Form, Panel, FlexboxGrid, useToaster, Message } from 'rsuite';

import type { NextPage } from 'next';
import {Textarea} from "components/form";
import { djRequest } from "utils/apirest";

import { Icon } from '@rsuite/icons';
import * as faTwitter from "@fortawesome/free-brands-svg-icons/faTwitter";
import * as faFacebook from "@fortawesome/free-brands-svg-icons/faFacebook";
import * as faInstagram from "@fortawesome/free-brands-svg-icons/faInstagram";
import * as faLinkedin from "@fortawesome/free-brands-svg-icons/faLinkedin";
import * as faYoutube from "@fortawesome/free-brands-svg-icons/faYoutube";

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

type SocialMediaProps = {
  name: string,
  faIcon: any
}

function SocialMedia(props: SocialMediaProps){
  const {name, faIcon} = props;
  return (
    <div style={{display: "flex", gap: "1em"}}>
      <Icon as={FaSvgIcon} faIcon={faIcon} />
      <p>{name}</p>
    </div>
  );
}

const ContactPage: NextPage = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const t = useTranslations('ContactUsPage');
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
          <InfoSection title={t('telephone')}>
            <li>+58 (0212)-362-82-68</li>
            <li>+58+0414-389-74-44</li>
          </InfoSection>

          <InfoSection title={t('publicAttention')}>
            <li><b>{t('mondayFriday.days')}</b>: {t('mondayFriday.hours')}</li>
            <li><b>{t('satSunday.days')}</b>: {t('satSunday.hours')}</li>
          </InfoSection>

          <InfoSection title={t('eMail')}>
            <li>{t('eMailQuestion')}</li>
          </InfoSection>

          <InfoSection
            title={t('linksOfInterest')}
            listStyleType="disc"
          >
            <li><a onClick={handleOpen}>{t('faq')}</a></li>
            <li><a>{t('terms')}</a></li>
          </InfoSection>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={12}>
              <h3>{t('followUs')}</h3>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={12}>
              <div style={{
                display: "flex", flexDirection: "column",
                gap: "0.5em"
              }}>
                <SocialMedia
                  name="Facebook"
                  faIcon={faFacebook}
                />
                <SocialMedia
                  name="Twitter"
                  faIcon={faTwitter}
                />
                <SocialMedia
                  name="Youtube"
                  faIcon={faYoutube}
                />
                <SocialMedia
                  name="Instagram"
                  faIcon={faInstagram}
                />
                <SocialMedia
                  name="Linkedin"
                  faIcon={faLinkedin}
                />
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Col>

        <Col xs={12}>
          <ButtonToolbar>
            <Button onClick={handleOpen}>{t('faq')}</Button>
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
            header={<h3>{t('contactForm.header')}</h3>}
            bordered
            style={{
              marginTop: "1em"
            }}
          >
            <Form fluid onSubmit={sendContactEmail} >
              <Form.Group controlId="to_mail">
                <Form.ControlLabel>{t('contactForm.for')}</Form.ControlLabel>
                <Form.Control type="email" name="to_mail" required />
              </Form.Group>
              <Form.Group controlId="firstname_lastname">
                <Form.ControlLabel>{t('contactForm.nameLastname')}</Form.ControlLabel>
                <Form.Control type="text" name="firstname_lastname" required />
              </Form.Group>
              <Form.Group controlId="body">
                <Form.ControlLabel>{t('contactForm.subject')}</Form.ControlLabel>
                <Form.Control rows={5} accepter={Textarea} type="text" name="message" required />
              </Form.Group>
              <Form.Group>
                <FlexboxGrid justify="center">

                  <Button appearance="primary" type="submit">{t('contactForm.send')}</Button>
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


