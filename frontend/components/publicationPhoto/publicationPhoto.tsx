import CustomPanel from "components/publications-panels/panel";
import EditIcon from "@rsuite/icons/Edit";
import WarningRoundIcon from "@rsuite/icons/WarningRound";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import React from "react";
import { Container, Content, Checkbox, IconButton } from "rsuite";
import ContactarAnunciante from "components/contactar-anunciante/contactarAnunciante";
import { useTranslations } from "next-intl";

function PublicationPhoto(props) {
  const TCard = useTranslations("cards");
  const TPanels = useTranslations("panels");

  const baseURL = "http://localhost:8000";
  const { data } = props;
  const { isLogin, isAdmin, isClient, sessionUserId } = props.session;

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
                  title={TPanels("types.details.tittle")}
                  url="details"
                  nameLink={TPanels("types.details.name")}
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title={TPanels("types.accesories.tittle")}
                  url="details"
                  nameLink={TPanels("types.accesories.name")}
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
                  title={TPanels("types.services.tittle")}
                  url="details"
                  nameLink={TPanels("types.services.name")}
                  id={item.id}
                  accessories={item.accessories}
                  details={item.details}
                  address={item.exact_location}
                />
                <CustomPanel
                  placement="auto"
                  title={TPanels("types.ubication.tittle")}
                  url="details"
                  nameLink={TPanels("types.ubication.name")}
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
                <p style={{ color: "#eb3626" }}>
                  {item.contract_type === "SALE"
                    ? TCard("contrat-type.sell")
                    : item.contract_type === "RENTAL"
                    ? TCard("contrat-type.rental")
                    : TCard("contrat-type.sell-rental")}
                </p>
                <p style={{ color: "#5ea83e" }}>
                  {item.status === "NEW"
                    ? TCard("status.new")
                    : TCard("status.used")}
                </p>
              </Container>
              <Container className="photo-vehicle-addres-data">
                <p>
                  <b>{TCard("addres.country")}: </b>
                  {item.location_city.location.split(">")[0]}
                </p>
                <p>
                  <b>{TCard("addres.city")}: </b>
                  {item.location_city.name}
                </p>
                <p>
                  <b>{TCard("addres.zone")}: </b>
                  {item.location_zone}
                </p>
              </Container>
              <ContactarAnunciante
                className="contactar-anunciante-button"
                id={item.id}
              />
              {isLogin ? (
                <Container className="publications-authenticated-buttons">
                  <IconButton
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
                    disabled={sessionUserId !== item.owner.id && !isAdmin} //solo admin o el dueño
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
            <a href="">{TCard("buttons.seeAllInfo")}</a>
          </Container>
        </Container>
      ))}
    </Container>
  );
}

export default PublicationPhoto;
