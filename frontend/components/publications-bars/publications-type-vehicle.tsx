import { useTranslations } from "next-intl";
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
  const TboxFilter = useTranslations("boxFilter");

  const selectTypeVehicle = (e: any) => {
    const value = e.target.value;
    props.setTypeVehicle(value);
    //props.setSubmit(true);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        active={props.typeVehicle === TypeVehicleEnum.CARRO}
        value={TypeVehicleEnum.CARRO}
        onClick={selectTypeVehicle}
      >
        {TboxFilter("typeVehicle.options.car")}
      </Button>
      <Button
        color="green"
        appearance="primary"
        active={props.typeVehicle === TypeVehicleEnum.CAMIONETA}
        value={TypeVehicleEnum.CAMIONETA}
        onClick={selectTypeVehicle}
      >
        {TboxFilter("typeVehicle.options.van")}
      </Button>
      <Button
        color="yellow"
        appearance="primary"
        active={props.typeVehicle === TypeVehicleEnum.CAMION}
        value={TypeVehicleEnum.CAMION}
        onClick={selectTypeVehicle}
      >
        {TboxFilter("typeVehicle.options.trunk")}
      </Button>
    </Container>
  );
}

export default PublicationsTypeVehicle;
