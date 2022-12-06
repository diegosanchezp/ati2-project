import React, { useState } from "react";
import { Container } from "rsuite";

import { TypeOrderPubliationsEnum } from "../../pages/publications/enums/publications.enum";

function PanelPublicationSeeMore({ address, id }) {
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=600,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };
  return (
    <Container>
      <p>Haga click oara ver mas informacion</p>
      <ul>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/fotos?id=${id}`)}
          >
            Ver fotos
          </a>
        </li>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/videos?id=${id}`)}
          >
            Ver videos
          </a>
        </li>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/details?id=${id}`)}
          >
            Ver ubicación exacta
          </a>
        </li>
      </ul>
      <p>Ublicacion exacta: {address} </p>
    </Container>
  );
}

export default PanelPublicationSeeMore;
