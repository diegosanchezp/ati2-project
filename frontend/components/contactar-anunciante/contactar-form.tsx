import React from "react";
import { Container } from "rsuite";
import CallContact from "./call";
import CallMeForm from "./callme";
import SendConsultaForm from "./send-consult";
import SendEmailForm from "./send-email";
import ScheduleVisitForm from "./visit";

const FormOption = React.forwardRef((props: any) => {
  if (props.option === 1) return <SendEmailForm />;
  if (props.option === 2) return <CallContact />;
  if (props.option === 3) return <CallMeForm />;
  if (props.option === 4) return <SendConsultaForm />;
  if (props.option === 5) return <ScheduleVisitForm />;
  return <Container>eeee</Container>;
});

function FormContactar(props: any) {
  return (
    <Container id="contactar-anunciante-form-container">
      <FormOption option={props.option} />
    </Container>
  );
}

export default FormContactar;
