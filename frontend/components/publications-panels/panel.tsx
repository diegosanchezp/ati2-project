import Link from "next/link";
import React from "react";
import { Popover, Whisper } from "rsuite";
import PanelPublicationMore from "./panel-more";

const openInNewTab = (url: string) => {
  window.open(
    url,
    "name",
    "width=600,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
  );
};

const CustomPopover = React.forwardRef(({ content, title, ...props }, ref) => {
  return (
    <Popover ref={ref} title={title} {...props}>
      <p>This is a Popover </p>
      <p>
        Especificaciones:a Confederación de Norteamérica, Centroamérica y el
        Caribe de Fútbol a Confederación de Norteamérica, Centroamérica y el
        Caribe de Fútbol{" "}
      </p>
      <PanelPublicationMore />
      <p>{content}</p>
    </Popover>
  );
});

const CustomPanel = ({
  placement,
  title,
  nameLink,
  url,
  id,
  //children: any,
}) => (
  <Whisper
    trigger="hover"
    placement={placement}
    controlId={`control-id-${placement}-${title}`}
    speaker={<CustomPopover content={"test content"} title={title} />}
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
/*<a
      //href="https://google.com"
      href="test"
      target="popup"
      onClick={() => openInNewTab("test")}
    >
      {nameLink}
    </a>*/
export default CustomPanel;
