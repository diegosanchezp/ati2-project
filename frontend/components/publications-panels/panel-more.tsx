import React, { useState } from "react";
import { Container } from "rsuite";

import { TypeOrderPubliationsEnum } from "../../pages/publications/enums/publications.enum";

function PanelPublicationMore() {
  return (
    <Container>
      <p>Haga click oara ver mas informacion</p>
      <ul>
        <li>
          <a>Ver fotos of </a>
        </li>
        <li>
          <a>Ver videos of </a>
        </li>
        <li>
          <a>Ver ubicacion exacta of </a>
        </li>
      </ul>
      <p>Ublicacion exacta: </p>
    </Container>
  );
}

export default PanelPublicationMore;
