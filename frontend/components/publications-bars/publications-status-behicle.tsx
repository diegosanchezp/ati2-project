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

import { TypeStatusVehicleEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsStatusVehicle(props: any) {
  const selectTypeStatus = (e: any) => {
    const value = e.target.value;
    props.setTypeStatus(value);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        onClick={selectTypeStatus}
        value={TypeStatusVehicleEnum.VENTA}
      >
        Venta
      </Button>
      <Button
        color="green"
        appearance="primary"
        onClick={selectTypeStatus}
        value={TypeStatusVehicleEnum.ALQUILER}
      >
        Alquiler
      </Button>
      <Button
        color="yellow"
        appearance="primary"
        onClick={selectTypeStatus}
        value={TypeStatusVehicleEnum.ALQUILER_Y_VENTA}
      >
        Alquiler y venta
      </Button>
    </Container>
  );
}

export default PublicationsStatusVehicle;
