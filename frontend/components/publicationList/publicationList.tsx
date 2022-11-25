import React from "react";
import EditIcon from "@rsuite/icons/Edit";
import WarningRoundIcon from "@rsuite/icons/WarningRound";
import VisibleIcon from "@rsuite/icons/Visible";
//import UnvisibleIcon from "@rsuite/icons/Unvisible";
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
    <Container className="publication-list">
      {list.map((item) => (
        <Container className="publication-card-list">
          <Content className="button-select">
            <Checkbox value={item.id} onChange={selectCard}></Checkbox>
          </Content>

          <Content>
            <Carousel className="custom-slider publication-card-list-img">
              {item.images.map((image) => (
                <img src={image} height="15" />
              ))}
            </Carousel>
          </Content>

          <Content className="vehicle-data">
            <p>{item.salePrice}</p>
            <p>{item.status}</p>
            <p>Marca {item.brand}</p>
            <p>Modelo {item.model}</p>
            <ContactarAnunciante className="contactar-anunciante-button" />
          </Content>

          <Content>
            <p>
              <b>Pais</b> {item.address.country}
            </p>
            <p>
              <b>Ciudad</b> {item.address.city}
            </p>
            <p>
              <b>Direccion</b> {item.address.address}
            </p>
          </Content>

          <Content className="publications-more-data">
            <CustomPanel
              placement="auto"
              title="Fotos"
              nameLink="Ver fotos"
              url="fotos"
              id={item.id}
            />
            <CustomPanel
              placement="auto"
              title="Videos"
              nameLink="Ver videos"
              url="videos"
              id={item.id}
            />
            <Container className="publication-list-photo-see-all">
              <a href="">Ver información completa</a>
            </Container>
          </Content>

          <Container className="publications-authenticated-buttons">
            <IconButton icon={<EditIcon />} circle size="sm" />
            <IconButton icon={<VisibleIcon />} circle size="sm" />
            <IconButton icon={<WarningRoundIcon />} circle size="sm" />
          </Container>
        </Container>
      ))}
    </Container>
  );
}

export default PublicationList;
