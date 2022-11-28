import CustomPanel from "components/publications-panels/panel";
import EditIcon from "@rsuite/icons/Edit";
import WarningRoundIcon from "@rsuite/icons/WarningRound";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
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
  Carousel,
  Checkbox,
  Popover,
  Whisper,
  IconButton,
} from "rsuite";
import { list } from "../../pages/publications/list-DELETE/data";
import ContactarAnunciante from "components/contactar-anunciante/contactarAnunciante";
import { ifError } from "assert";
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
const CustomComponent = ({ placement, title, nameLink, children: any }) => (
  <Whisper
    trigger="hover"
    placement={placement}
    controlId={`control-id-${placement}`}
    speaker={<CustomPopover content={"test content"} title={title} />}
    enterable
  >
    <a
      href="https://google.com"
      target="popup"
      onClick={() => openInNewTab("https://google.com")}
    >
      {nameLink}
    </a>
  </Whisper>
);

const openInNewTab = (url: string) => {
  window.open(
    url,
    "name",
    "width=600,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
  );
};
function PublicationPhoto(props) {
  const baseURL = "http://localhost:8000";
  const { data } = props;
  const { isLogin, isAdmin, isClient } = props.session;
  const selectCard = (e) => {
    const vehicleID = e;

    if (props.lastCard == vehicleID) {
      props.setLastCard(0);
    } else {
      props.setLastCard(vehicleID);
    }
    let aux = props.cardSelected;
    const include = aux.includes(vehicleID);
    console.log("include", include);
    if (include) {
      aux = aux.filter((id) => id != vehicleID);
    } else {
      console.log("hago include");
      aux.push(vehicleID);
    }
    props.setCardSelected(aux);

    console.log("ACTUALIZADO ", props.cardSelected);
  };

  return (
    <Container className="publication-photo">
      {data.map((item) => (
        <Container className="publication-card-photo">
          <Container className="publication-card-photo-columns">
            <Content className="button-select">
              <Checkbox value={item.id} onChange={selectCard}></Checkbox>
            </Content>
            <Content className="photo-data">
              <img
                className="publication-card-photo-img"
                src={
                  item.images[0]?.image
                    ? `${baseURL}${item.images[0].image}`
                    : "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                }
              ></img>
              <p className="price-photo">
                <b>
                  {item.sale_price} {item.currency.code}
                </b>
              </p>
              <Container className="publications-more-data">
                <CustomPanel
                  placement="auto"
                  title="Detalles del vehículo"
                  url="details"
                  nameLink="Ver detalles"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title="Accesorios del vehículo"
                  url="details"
                  nameLink="Ver accesorios"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title="Fotos"
                  url="fotos"
                  nameLink="Ver fotos"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title="Videos"
                  url="videos"
                  nameLink="Ver videos"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title="Servicios"
                  url="details"
                  nameLink="Ver servicios al día"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title="Ubicacion"
                  url="details"
                  nameLink="Ver ubicación exacta"
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
              </Container>
            </Content>
            <Content className="photo-data-addres">
              <Container className="photo-vehicle-status-data">
                <p style={{ color: "#2589f5" }}>
                  {item.model.brand.name}-{item.model.name}
                </p>
                <p style={{ color: "#eb3626" }}>{item.contract_type}</p>
                <p style={{ color: "#5ea83e" }}>{item.status}</p>
              </Container>
              <Container className="photo-vehicle-addres-data">
                <p>
                  <b>Pais: </b>
                  {item.location_city.location.split(">")[0]}
                </p>
                <p>
                  <b>Ciudad: </b>
                  {item.location_city.name}
                </p>
                <p>
                  <b>Zona: </b>
                  {item.location_zone}
                </p>
              </Container>
              <ContactarAnunciante className="contactar-anunciante-button" />
              {isLogin ? (
                <Container className="publications-authenticated-buttons">
                  <IconButton
                    icon={<EditIcon />}
                    disabled={!isClient}
                    circle
                    size="sm"
                  />
                  <IconButton
                    icon={<VisibleIcon />}
                    disabled={!isClient && !isAdmin}
                    circle
                    size="sm"
                  />
                  <IconButton
                    icon={<WarningRoundIcon />}
                    disabled={!isClient && !isAdmin}
                    circle
                    size="sm"
                  />
                </Container>
              ) : (
                <Container></Container>
              )}
            </Content>
          </Container>
          <Container className="publication-card-photo-see-all">
            <a href="">Ver información completa</a>
          </Container>
        </Container>
      ))}
    </Container>
  );
}

export default PublicationPhoto;
