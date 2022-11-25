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

import { TypeVehicleEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsTypeVehicle(props: any) {
  const selectTypeVehicle = (e: any) => {
    const value = e.target.value;
    props.setTypeVehicle(value);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        value={TypeVehicleEnum.CARRO}
        onClick={selectTypeVehicle}
      >
        Carro
      </Button>
      <Button
        color="green"
        appearance="primary"
        value={TypeVehicleEnum.CAMIONETA}
        onClick={selectTypeVehicle}
      >
        Camioneta
      </Button>
      <Button
        color="yellow"
        appearance="primary"
        value={TypeVehicleEnum.CAMION}
        onClick={selectTypeVehicle}
      >
        Camión
      </Button>
    </Container>
  );
}

export default PublicationsTypeVehicle;
