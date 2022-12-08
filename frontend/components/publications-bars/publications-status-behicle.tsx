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

import { TypeStatusVehicleEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsStatusVehicle(props: any) {
  const TboxFilter = useTranslations("boxFilter");

  const selectTypeStatus = (e: any) => {
    const value = e.target.value;
    props.setTypeStatus(value);
    props.setSubmit(true);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        active={props.typeStatus === TypeStatusVehicleEnum.VENTA}
        onClick={selectTypeStatus}
        value={TypeStatusVehicleEnum.VENTA}
      >
        {TboxFilter("contractType.options.sell")}
      </Button>
      <Button
        color="green"
        appearance="primary"
        active={props.typeStatus === TypeStatusVehicleEnum.ALQUILER}
        onClick={selectTypeStatus}
        value={TypeStatusVehicleEnum.ALQUILER}
      >
        {TboxFilter("contractType.options.rental")}
      </Button>
      <Button
        color="yellow"
        appearance="primary"
        onClick={selectTypeStatus}
        active={props.typeStatus === TypeStatusVehicleEnum.ALQUILER_Y_VENTA}
        value={TypeStatusVehicleEnum.ALQUILER_Y_VENTA}
      >
        {TboxFilter("contractType.options.sell-rental")}
      </Button>
    </Container>
  );
}

export default PublicationsStatusVehicle;
