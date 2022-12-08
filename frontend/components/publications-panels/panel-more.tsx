import React, { useState } from "react";
import { Container } from "rsuite";

import { TypeOrderPubliationsEnum } from "../../pages/publications/enums/publications.enum";
import { withTranslations } from "utils/i18n";
import { useTranslations } from "next-intl";
export const getServerSideProps = withTranslations({
  // use translations located in
  // translations/auth
  folderPath: "publications",
});

function PanelPublicationSeeMore({ address, id }) {
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=600,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };
  const TPanels = useTranslations("panels");
  return (
    <Container>
      <p>{TPanels("see-more")}</p>
      <ul>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/fotos?id=${id}`)}
          >
            {TPanels("types.photos.tittle")}
          </a>
        </li>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/videos?id=${id}`)}
          >
            {TPanels("types.videos.tittle")}
          </a>
        </li>
        <li>
          <a
            //href="https://google.com"
            href="test"
            target="popup"
            onClick={() => openInNewTab(`publications/details?id=${id}`)}
          >
            {TPanels("types.ubication.name")}
          </a>
        </li>
      </ul>
      <p>
        {TPanels("types.ubication.tittle")}: {address}{" "}
      </p>
    </Container>
  );
}

export default PanelPublicationSeeMore;
