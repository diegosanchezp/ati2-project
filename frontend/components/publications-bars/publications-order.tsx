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

import { TypeOrderPubliationsEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsOrder(props: any) {
  const TboxFilter = useTranslations("boxFilter");

  const selectTypeOder = (e: any) => {
    const value = e.target.value;
    props.setTypeOrder(value);
    props.setSubmit(true);
  };
  return (
    <Container className="options-buttons">
      <Button
        color="blue"
        appearance="primary"
        onClick={selectTypeOder}
        active={props.typeOrder === TypeOrderPubliationsEnum.PRECIO}
        value={TypeOrderPubliationsEnum.PRECIO}
      >
        {TboxFilter("order.options.price")}
      </Button>
      <Button
        color="green"
        appearance="primary"
        onClick={selectTypeOder}
        active={props.typeOrder === TypeOrderPubliationsEnum.ALQUILER}
        value={TypeOrderPubliationsEnum.ALQUILER}
      >
        {TboxFilter("order.options.rental")}
      </Button>
    </Container>
  );
}

export default PublicationsOrder;
