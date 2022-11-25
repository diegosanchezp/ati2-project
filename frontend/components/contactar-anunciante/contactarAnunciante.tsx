import React from "react";
import { Container, Button } from "rsuite";

function ContactarAnunciante(props: any) {
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=800,height=900,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };

  return (
    <Container>
      <Button
        color="orange"
        appearance="primary"
        target="popup"
        onClick={() => openInNewTab(`contactar?id=1`)}
        //href="javascript:window.open('https://www.google.es','','toolbar=yes', 'location=no', 'directories=no', 'status=no','menubar=no', 'scrollbars=no', 'resizable=yes', 'width=650', 'height=450', 'left=0', 'top=0');void 0"
      >
        Contactar anunciante
      </Button>
    </Container>
  );
}

export default ContactarAnunciante;
