import { useEffect, useState } from "react";
import { Container, Button, Divider, Pagination } from "rsuite";

import { withTranslations } from "utils/i18n";
import { useTranslations } from "next-intl";
export const getServerSideProps = withTranslations({
  // use translations located in
  // translations/auth
  folderPath: "publications",
});

//COMPONENTS
import PublicationList from "components/publicationList/publicationList";
import PublicationPhoto from "components/publicationPhoto/publicationPhoto";

//UTILS
import {
  TypeVisualizerEnum
} from "./enums/publications.enum";
import PublicationsType from "components/publications-bars/publications-type-render";
import PublicationsTypeVehicle from "components/publications-bars/publications-type-vehicle";
import PublicationsOrder from "components/publications-bars/publications-order";
import PublicationsStatusVehicle from "components/publications-bars/publications-status-behicle";
import FilterVehicles from "components/filter-vehicle/filter-vehicle";
import { djRequest, getCSRF } from "utils/apirest";
import { useSession } from "auth";

function PublicationsPage() {
  const TboxFilter = useTranslations("boxFilter");
  const TheaderButtons = useTranslations("headerButtons");

  //states for query, tal vez agunos deben iniciar de otra forma
  const [continent, setContinent] = useState("");
  const [state, setStates] = useState([]);
  const [typeStatus, setTypeStatus] = useState("");
  const [typePrice, setTypePrice] = useState("");
  const [typeOrder, setTypeOrder] = useState("");
  //other filters
  const [type_vehicle, setTypeVehicle] = useState("");

  const [submit, setSubmit] = useState(true);
  const [cleanStatesQuery, setCleanStatesQuery] = useState(true);

  const [typeVisualizer, setTypeVisualizer] = useState(
    TypeVisualizerEnum.PHOTO
  );

  //pagnation
  const [activePage, setActivePage] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const vehiclesPerPage = 10;
  const [cardsSelected, setCardsSelected] = useState([]);
  const [lastCard, setLastCard] = useState(0);
  const [vehicles, setVehicles] = useState([]);

  //session data variables
  let isClient = false;
  let isAdmin = false;
  let isLogin = false;
  let sessionUserId = -1;

  setSessionData();
  function setSessionData() {
    const { dispatch, session } = useSession();
    //console.log("session user test ", session);
    //console.log("login  ", isLogin);
    if (session.user) {
      isLogin = true;
      //console.log("Publications user ", session.user);
      isAdmin = session.user?.is_superuser || false;
      sessionUserId = session.user.id || -1;
      isClient = !isAdmin; //en cada carta si el ownerId es igual al session cliente
    }
  }

  //estados 5 botones
  const [optionsButtons, setOptionsButtons] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  //states a enviar a FilterVehicles
  const queryFilter = {
    state,
    setStates,
    continent,
    setContinent,
    typePrice,
    cleanStatesQuery,
    setCleanStatesQuery,
  };
  //states para generar url, NOTA los nombres deben ser iguales a el key del query a recibir en el back
  const queryStates = { state, continent, type_vehicle };

  //effect para construir el url, se llama al presionar buscar, cambiando el valor del state se puede llamar en cualquier punto
  useEffect(() => {
    if (submit) {
      let url = getURLQuery();

      const paginationString = `page=${activePage}&page_quantity=${vehiclesPerPage}`;
      if (url.length > 0) {
        url = `${url}&${paginationString}`;
      } else {
        url = `?${paginationString}`;
      }
      //console.log("ejecutar busqueda a ", url);
      setSubmit(false);

      const fetchData = async () => {
        const { csrfToken, csrfRes } = await getCSRF();

        const response = await djRequest("vehicles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken as string,
          },
        });

        if (response.ok) {
          const data = await response.json();
          //console.log("data ", data.data);
          setVehicles(data.data);
          setTotalVehicles(data.total_elements);
          return data;
        }
      };

      fetchData();
    }
  }, [submit]);

  //effect buscar cuando se cambia de pag
  //TODO funcion
  useEffect(() => {
    let url = getURLQuery();

    const paginationString = `page=${activePage}&page_quantity=${vehiclesPerPage}`;
    if (url.length > 0) {
      url = `${url}&${paginationString}`;
    } else {
      url = `?${paginationString}`;
    }
    //console.log("ejecutar busqueda a ", url);
    setSubmit(false);

    const fetchData = async () => {
      const { csrfToken, csrfRes } = await getCSRF();

      const response = await djRequest(`vehicles/${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken as string,
        },
      });
      //console.log("fetch of getVehicles");

      if (response.ok) {
        const data = await response.json();
        //console.log("vehicles of change page data ", data.data);
        setVehicles(data.data);
        setTotalVehicles(data.total_elements);
        return data;
      }
    };
    fetchData();
  }, [activePage]);

  //funcion genera el url en base a los valores de los states
  function getURLQuery() {
    // console.log("state", state);
    //generamos lista de todos los states existentes
    const queryList = Object.keys(queryStates);
    // console.log("querylist", queryList);
    let url = "";
    for (const queryItem of queryList) {
      //console.log("url lengggg ", url.length, "and query item ", queryItem);
      const value = queryStates[queryItem];
      let validValue = false;
      const typeValue = typeof value;

      //TODO quizas hacen falta mas validaciones segun el tipo y el filtro, esto deberia cubrir obj (arraya de check picket) y sleect picket simple
      if (typeValue === "string") {
        if (value !== "") validValue = true;
      }
      if (typeValue === "object") {
        //console.log(Object.keys(value));
        if (value && Object.keys(value).length > 0) validValue = true;
      }

      if (validValue) {
        if (url.length > 0) {
          url = `${url}&${queryItem}=${value}`;
        } else {
          url = `?${queryItem}=${value}`;
        }
      }
    }
    return url;
  }

  //efect para seleccion de vehiculo
  useEffect(() => {
    //console.log("en effect ", cardsSelected);
    let isOwner = true;
    const len = cardsSelected.length;
    //console.log("leeen ", len);
    //console.log("cards selected ", cardsSelected);
    //console.log("last card ", lastCard);
    if (len === 1) {
      const vehicleSelect = vehicles.filter(
        (vehicle) => vehicle?.id === lastCard
      )[0];
      //console.log("vehicle selected ", vehicleSelect);
      isOwner = vehicleSelect.owner.id === sessionUserId;
    }else if(len > 1){
      const vehicleSelect = vehicles.filter(
        (vehicle) => cardsSelected.includes(vehicle?.id)
      );
      for(let vehicleSelected of vehicleSelect){
        isOwner = vehicleSelected.owner.id !== sessionUserId ? false : isOwner;
      }
    }

    //Relacion botones-session
    const seeButton = true;
    const editButton = isLogin && isOwner;
    const deshabilitarButton = isLogin && (isAdmin || isOwner);
    const habilitarButton = isLogin && (isAdmin || isOwner);
    const deleteButton = isLogin && (isAdmin || isOwner);
    const activeButtons = len === 1;
    const noactiveButtons = len === 0;
    const moreCards = len >= 2;
    if (activeButtons) {
      //console.log("tengo que activar botones");
      setOptionsButtons([
        !seeButton,
        !editButton,
        !deshabilitarButton,
        !habilitarButton,
        !deleteButton,
      ]);
    } else {
      //setOptionsButtons([true, true, true, true, true]);
    }
    if (noactiveButtons) {
      setOptionsButtons([true, true, true, true, true]);
    }
    if (moreCards) {
      // console.log("more os 1 card ", len);
      //habilitar -> habilitar, deshabilitar,eliminar
      setOptionsButtons([
        true,
        true,
        !deshabilitarButton,
        !habilitarButton,
        !deleteButton,
      ]);
    }
    //console.log("----------------------------------");
  }, [cardsSelected]);
  
  const sessionObj = { isLogin, isAdmin, isClient, sessionUserId };

  const handleClickDelete = async () => {
    //console.log(cardsSelected);
    const { csrfToken } = await getCSRF();
    const response = await djRequest("deletevehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken as string,
      },
      body: JSON.stringify({ ids: cardsSelected })
    });
    setCardsSelected([]);
    setSubmit(true);
  }

  return (
    <Container id="publications-panel">
      <FilterVehicles setSubmit={setSubmit} queryFilter={queryFilter} />
      <Container id="publications">
        <Container className="options-buttons">
          <Button
            color="blue"
            appearance="primary"
            disabled={optionsButtons[0]}
          >
            {TheaderButtons("see")}
          </Button>
          <Button
            color="green"
            appearance="primary"
            disabled={optionsButtons[1]}
          >
            {TheaderButtons("edit")}
          </Button>
          <Button
            color="yellow"
            appearance="primary"
            disabled={optionsButtons[2]}
          >
            {TheaderButtons("disable")}
          </Button>
          <Button
            color="violet"
            appearance="primary"
            disabled={optionsButtons[3]}
          >
            {TheaderButtons("enable")}
          </Button>
          <Button color="red" appearance="primary" onClick={handleClickDelete} disabled={optionsButtons[4]}>
            {TheaderButtons("delete")}
          </Button>
        </Container>
        <Divider />
        <p>{TboxFilter("info")}</p>
        <Container id="publications-options">
          <Container id="publications-options-header">
            <p>{TboxFilter("tittle")}</p>
          </Container>

          <Container id="pubications-options-bars">
            <Container
              className="pubications-options-bar"
              id="type-publications-bar"
            >
              <Container>
                <p>{TboxFilter("typeRender.tittle")}</p>
              </Container>
              <PublicationsType
                setCardSelected={setCardsSelected}
                setLastCard={setLastCard}
                setTypeVisualizer={setTypeVisualizer}
                typeVisualizer={typeVisualizer}
              />
            </Container>
            <Container className="pubications-options-bar">
              <p>{TboxFilter("filterInfo")}</p>
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>{TboxFilter("typeVehicle.tittle")}</p>
              </Container>
              <PublicationsTypeVehicle
                typeVehicle={type_vehicle}
                setTypeVehicle={setTypeVehicle}
                setSubmit={setSubmit}
              />
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>{TboxFilter("order.tittle")}</p>
              </Container>
              <PublicationsOrder
                typeOrder={typeOrder}
                setTypeOrder={setTypeOrder}
                setSubmit={setSubmit}
              />
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>{TboxFilter("contractType.tittle")}</p>
              </Container>
              <PublicationsStatusVehicle
                typeStatus={typeStatus}
                setTypeStatus={setTypeStatus}
                setSubmit={setSubmit}
              />
            </Container>
          </Container>
        </Container>
        <Divider />
        {totalVehicles > 0 ? (
          <Container>
            <Container id="publications-pagination">
              <Pagination
                prev
                last
                next
                first
                size="md"
                total={totalVehicles} //cant vehiculos
                limit={vehiclesPerPage} //cant vehiculos por pag
                activePage={activePage}
                onChangePage={setActivePage}
              />
            </Container>
            <Divider />
          </Container>
        ) : (
          <Container></Container>
        )}

        <Container>
          {typeVisualizer === TypeVisualizerEnum.PHOTO ? (
            <PublicationPhoto
              cardSelected={cardsSelected}
              setCardSelected={setCardsSelected}
              setLastCard={setLastCard}
              lastCard={lastCard}
              data={vehicles}
              session={sessionObj}
            />
          ) : (
            <PublicationList
              cardSelected={cardsSelected}
              setCardSelected={setCardsSelected}
              setLastCard={setLastCard}
              lastCard={lastCard}
              data={vehicles}
              session={sessionObj}
            />
          )}
        </Container>
      </Container>
    </Container>
  );
}
//
export default PublicationsPage;
