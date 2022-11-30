import React from "react";
import { Container } from "rsuite";
import CallContact from "./call";
import CallMeForm from "./callme";
import SendConsultaForm from "./send-consult";
import SendEmailForm from "./send-email";
import ScheduleVisitForm from "./visit";

const FormOption = React.forwardRef((props: any) => {
  if (props.option === 1) return <SendEmailForm vehicle={props.vehicle} />;
  if (props.option === 2) return <CallContact vehicle={props.vehicle} />;
  if (props.option === 3) return <CallMeForm vehicle={props.vehicle} />;
  if (props.option === 4) return <SendConsultaForm vehicle={props.vehicle} />;
  if (props.option === 5) return <ScheduleVisitForm vehicle={props.vehicle} />;
  return <Container>Selecciona una opcion valida</Container>;
});

function FormContactar(props: any) {
  console.log("FormContactar props ", props);
  return (
    <Container id="contactar-anunciante-form-container">
      <FormOption option={props.option} vehicle={props.vehicle} />
    </Container>
  );
}

export default FormContactar;
