import React from "react";
import EditIcon from "@rsuite/icons/Edit";
import WarningRoundIcon from "@rsuite/icons/WarningRound";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import {
  Container,
  Content,
  Button,
  Carousel,
  IconButton,
  Checkbox,
} from "rsuite";
import CustomPanel from "components/publications-panels/panel";
import ContactarAnunciante from "components/contactar-anunciante/contactarAnunciante";
import { useTranslations } from "next-intl";

function PublicationList(props: any) {
  const TCard = useTranslations("cards");
  const TPanels = useTranslations("panels");

  const baseURL = "http://localhost:8000";
  const { data } = props;
  const { isLogin, isAdmin, isClient, sessionUserId } = props.session;

  const selectCard = (e) => {
    const vehicleID = e;

    let aux = [...props.cardSelected];
    const include = aux.includes(vehicleID);
    if (include) {
      //se desselecciono -> se elimina
      //console.log("elimno id");
      aux = aux.filter((id) => id != vehicleID);
    } else {
      //console.log("hago include");
      aux.push(vehicleID);
    }
    props.setCardSelected(aux);
    if (aux.length === 1) {
      props.setLastCard(aux[0]);
    }
    if (aux.length === 0 || aux.length > 1) {
      props.setLastCard(0);
    }

    //console.log("ACTUALIZADO ", props.cardSelected);
  };
  return (
    <Container className="publication-list">
      {data.map((item) => (
        <Container className="publication-card-list" key={item.id}>
          <Content className="button-select">
            <Checkbox
              checked={props.cardSelected.includes(item.id)}
              value={item.id}
              onChange={selectCard}
            ></Checkbox>
          </Content>

          <Content>
            <Carousel className="custom-slider publication-card-list-img">
              {item.images.length > 0 ? (
                item.images.map((image) => (
                  <img src={`${baseURL}${image.image}`} height="15" />
                ))
              ) : (
                <img
                  src={
                    "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                  }
                  height="15"
                />
              )}
            </Carousel>
          </Content>

          <Content className="vehicle-data">
            <p>
              {item.sale_price} {item.currency.code}
            </p>
            <p>
              {item.status === "NEW"
                ? TCard("status.new")
                : TCard("status.used")}
            </p>
            <p>
              {TCard("brand")}: {item.model.brand.name}{" "}
            </p>
            <p>
              {TCard("model")}: {item.model.name}
            </p>
            <ContactarAnunciante
              className="contactar-anunciante-button"
              id={item.id}
            />
          </Content>

          <Content>
            <p>
              <b>{TCard("addres.country")}: </b>{" "}
              {item.location_city.location.split(">")[0]}
            </p>
            <p>
              <b>{TCard("addres.city")}: </b> {item.location_city.name}
            </p>
            <p>
              <b>{TCard("addres.zone")}: </b> {item.location_zone}
            </p>
          </Content>

          <Content className="publications-more-data">
            <CustomPanel
              placement="auto"
              title={TPanels("types.videos.tittle")}
              url="videos"
              nameLink={TPanels("types.videos.name")}
              id={item.id}
              accessories={item.accessories}
              details={item.details}
              address={item.exact_location}
            />
            <CustomPanel
              placement="auto"
              title={TPanels("types.photos.tittle")}
              url="fotos"
              nameLink={TPanels("types.photos.name")}
              id={item.id}
              accessories={item.accessories}
              details={item.details}
              address={item.exact_location}
            />
            <Container className="publication-list-photo-see-all">
              {isLogin ? (
                sessionUserId === item.owner.id ? (
                  <a href={`vehicles/${item.id}/edit`}>
                    {TCard("buttons.seeAllInfo")}
                  </a>
                ) : (
                  <Container></Container>
                )
              ) : (
                <Container></Container>
              )}
            </Container>
          </Content>
          {isLogin ? (
            <Container className="publications-authenticated-buttons">
              <IconButton
                onClick={() => open(`vehicles/${item.id}/edit`)}
                //href={`vehicles/${item.id}/edit`}
                icon={<EditIcon />}
                disabled={sessionUserId !== item.owner.id} ////solo  el dueño
                circle
                size="sm"
              />
              {item.publication_enabled ? (
                <IconButton
                  icon={<UnvisibleIcon />}
                  disabled={sessionUserId !== item.owner.id && !isAdmin} //solo admin o el dueño | deshabilitar
                  circle
                  size="sm"
                />
              ) : (
                <IconButton
                  icon={<VisibleIcon />}
                  disabled={sessionUserId !== item.owner.id && !isAdmin} //solo admin o el dueño | habilitar
                  circle
                  size="sm"
                />
              )}

              <IconButton
                icon={<WarningRoundIcon />}
                onClick={() => {
                  props.handleClickDeleteItem(item.id);
                }}
                disabled={sessionUserId !== item.owner.id && !isAdmin} //solo admin o el dueño
                circle
                size="sm"
              />
            </Container>
          ) : (
            <Container></Container>
          )}
        </Container>
      ))}
    </Container>
  );
}

export default PublicationList;
