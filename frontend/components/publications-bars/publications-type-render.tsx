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

import { TypeVisualizerEnum } from "../../pages/publications/enums/publications.enum";

function PublicationsType(props: any) {
  const isPhoto = props.typeVisualizer === TypeVisualizerEnum.PHOTO;
  //true -> list = false | false -> list = true
  const [photo, setPhoto] = useState(isPhoto);
  const [list, setList] = useState(!isPhoto);

  const selectType = (e: any) => {
    const value = e;
    props.setTypeVisualizer(e);
    const isPhoto = e === TypeVisualizerEnum.PHOTO;
    setPhoto(isPhoto);
    setList(!isPhoto);
    //reset card selected
    props.setCardSelected([]);
    props.setLastCard(0);
  };
  return (
    <Container>
      <RadioGroup name="radioList" inline>
        <Radio
          value={TypeVisualizerEnum.PHOTO}
          checked={photo}
          onChange={selectType}
        >
          Foto
        </Radio>
        <Radio
          value={TypeVisualizerEnum.LIST}
          checked={list}
          onChange={selectType}
        >
          Lista
        </Radio>
      </RadioGroup>
    </Container>
  );
}

export default PublicationsType;
