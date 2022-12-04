import Link from "next/link";
import React from "react";
import { Container, Popover, Whisper } from "rsuite";
import PanelPublicationSeeMore from "./panel-more";

const openInNewTab = (url: string) => {
  window.open(
    url,
    "name",
    "width=850,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
  );
};

const CustomPopover = React.forwardRef(
  ({ content, title, accessories, address, id, details, ...props }, ref) => {
    const noAccessoriBox =
      title === "Ubicacion" || title === "Detalles del vehículo";
    console.log("noAccessoriBox ", noAccessoriBox, "detalles ", details);
    const listAccesories = accessories ? accessories?.split(",") : [];
    const listDetails = details ? details?.split(",") : [];
    return (
      <Popover ref={ref} title={title} {...props}>
        {noAccessoriBox ? (
          <Container>
            <ul>
              {listDetails.map((accesorie) => (
                <li>
                  <p>{accesorie}</p>
                </li>
              ))}
            </ul>
          </Container>
        ) : (
          <Container>
            <p>Accesorios del vehiculo </p>
            <ul>
              {listAccesories.map((accesorie) => (
                <li>
                  <p>{accesorie}</p>
                </li>
              ))}
            </ul>
          </Container>
        )}

        <PanelPublicationSeeMore address={address} id={id} />
      </Popover>
    );
  }
);

const CustomPanel = ({
  placement,
  title,
  nameLink,
  url,
  id,
  accessories,
  address,
  details,
}: any) => (
  <Whisper
    trigger="hover"
    placement={placement}
    controlId={`control-id-${placement}-${title}`}
    speaker={
      <CustomPopover
        content={"test content"}
        title={title}
        accessories={accessories}
        address={address}
        id={id}
        details={details}
      />
    }
    enterable
  >
    <a
      //href="https://google.com"
      href="test"
      target="popup"
      onClick={() => openInNewTab(`publications/${url}?id=${id}`)}
    >
      {nameLink}
    </a>
  </Whisper>
);

export default CustomPanel;
