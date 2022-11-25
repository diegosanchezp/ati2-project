import React, { useState } from "react";
import {
  Container,
  Header,
  Content,
  Navbar,
  Nav,
  Button,
  Divider,
  RadioGroup,
  Radio,
} from "rsuite";

import { TypeOrderPubliationsEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsOrder(props: any) {
  const selectTypeOder = (e: any) => {
    const value = e.target.value;
    props.setTypeOrder(value);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        onClick={selectTypeOder}
        value={TypeOrderPubliationsEnum.PRECIO}
      >
        Precio
      </Button>
      <Button
        color="green"
        appearance="primary"
        onClick={selectTypeOder}
        value={TypeOrderPubliationsEnum.ALQUILER}
      >
        Alquiler
      </Button>
    </Container>
  );
}

export default PublicationsOrder;
