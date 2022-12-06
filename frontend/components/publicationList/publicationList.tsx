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
import { list } from "../../pages/publications/list-DELETE/data";
import CustomPanel from "components/publications-panels/panel";
import ContactarAnunciante from "components/contactar-anunciante/contactarAnunciante";

function PublicationList(props: any) {
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
    //console.log("include", include);
    if (include) {
      aux = aux.filter((id) => id != vehicleID);
    } else {
      //console.log("hago include");
      aux.push(vehicleID);
    }
    props.setCardSelected(aux);

    //console.log("ACTUALIZADO ", props.cardSelected);
  };
  return (
    <Container className="publication-list">
      {data.map((item) => (
        <Container className="publication-card-list">
          <Content className="button-select">
            <Checkbox value={item.id} onChange={selectCard}></Checkbox>
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
            <p>{item.sale_price}</p>
            <p>{item.status}</p>
            <p>Marca {item.model.brand.name}</p>
            <p>Modelo {item.model.name}</p>
            <ContactarAnunciante
              className="contactar-anunciante-button"
              id={item.id}
            />
          </Content>

          <Content>
            <p>
              <b>Pais</b> {item.location_city.location.split(">")[0]}
            </p>
            <p>
              <b>Ciudad</b> {item.location_city.name}
            </p>
            <p>
              <b>Direccion</b> {item.location_zone}
            </p>
          </Content>

          <Content className="publications-more-data">
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
            <Container className="publication-list-photo-see-all">
              <a href="">Ver información completa</a>
            </Container>
          </Content>
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
        </Container>
      ))}
    </Container>
  );
}

export default PublicationList;
