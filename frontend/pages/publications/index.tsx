import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Divider,
  Radio,
  RadioGroup,
  Pagination,
  PanelGroup,
  Panel,
  CheckPicker,
  SelectPicker,
  Form,
} from "rsuite";

//COMPONENTS
import PublicationList from "components/publicationList/publicationList";
import PublicationPhoto from "components/publicationPhoto/publicationPhoto";

//UTILS
import {
  TypeVisualizerEnum,
  TypeVehicleEnum,
  TypeOrderPubliationsEnum,
  TypeStatusVehicleEnum,
} from "./enums/publications.enum";
import PublicationsType from "components/publications-bars/publications-type-render";
import PublicationsTypeVehicle from "components/publications-bars/publications-type-vehicle";
import PublicationsOrder from "components/publications-bars/publications-order";
import PublicationsStatusVehicle from "components/publications-bars/publications-status-behicle";
import FilterVehicles from "components/filter-vehicle/filter-vehicle";
import { url } from "inspector";
import { getURL } from "next/dist/shared/lib/utils";
import next from "next";
import { djRequest, getCSRF } from "utils/apirest";
import { useSession } from "auth";

function PublicationsPage() {
  //states for query, tal vez agunos deben iniciar de otra forma
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [state, setStates] = useState([]);
  const [city, setCity] = useState("");
  const [typeStatus, setTypeStatus] = useState(TypeStatusVehicleEnum.ALL);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [typePrice, setTypePrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [seeAlso, setSeeAlso] = useState("");
  const [currency, setCurrency] = useState("");
  const [typeOrder, setTypeOrder] = useState(TypeOrderPubliationsEnum.PRECIO);
  //other filters
  const [typeVehicle, setTypeVehicle] = useState(TypeVehicleEnum.ALL);

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
    console.log("session user test ", session);
    console.log("login  ", isLogin);
    if (session.user) {
      isLogin = true;
      console.log("Publications user ", session.user);
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
  const queryStates = { state, continent };

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
      console.log("ejecutar busqueda a ", url);
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
          console.log("data ", data.data);
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
    console.log("ejecutar busqueda a ", url);
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
      console.log("fetch of getVehicles");

      if (response.ok) {
        const data = await response.json();
        console.log("vehicles of change page data ", data.data);
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
        console.log(Object.keys(value));
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
    //TODO verificar si el cliente es el dueño del auto, revisar toda esta logica
    const len = cardsSelected.length;

    //Relacion botones-session
    const seeButton = true;
    const editButton = isLogin && isClient;
    const deshabilitarButton = isLogin && (isAdmin || isClient);
    const habilitarButton = isLogin && (isAdmin || isClient);
    const deleteButton = isLogin && (isAdmin || isClient);

    const activeButtons = len === 1;
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
      setOptionsButtons([true, true, true, true, true]);
    }
    if (moreCards) {
      console.log("more os 1 card ", len);
      //habilitar -> habilitar, deshabilitar,eliminar
      //setOptionsButtons([true, true, !deshabilitarButton, !habilitarButton, !deleteButton]);
    }
    //console.log("----------------------------------");
  }, [lastCard]);
  const sessionObj = { isLogin, isAdmin, isClient, sessionUserId };

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
            Ver detalle
          </Button>
          <Button
            color="green"
            appearance="primary"
            disabled={optionsButtons[1]}
          >
            Modificar
          </Button>
          <Button
            color="yellow"
            appearance="primary"
            disabled={optionsButtons[2]}
          >
            Deshabilitar
          </Button>
          <Button
            color="violet"
            appearance="primary"
            disabled={optionsButtons[3]}
          >
            Habilitar
          </Button>
          <Button color="red" appearance="primary" disabled={optionsButtons[4]}>
            Eliminar
          </Button>
        </Container>
        <Divider />
        <p>
          Haz clic en el vehículo de tu preferencia, para ver más información
        </p>
        <Container id="publications-options">
          <Container id="publications-options-header">
            <p>Publicaciones realizadas</p>
          </Container>

          <Container id="pubications-options-bars">
            <Container
              className="pubications-options-bar"
              id="type-publications-bar"
            >
              <Container>
                <p>Ver listado como:</p>
              </Container>
              <PublicationsType
                setCardSelected={setCardsSelected}
                setLastCard={setLastCard}
                setTypeVisualizer={setTypeVisualizer}
                typeVisualizer={typeVisualizer}
              />
            </Container>
            <Container className="pubications-options-bar">
              <p>
                Seleccione los filtros especificados a continuación, si desea
                filtrar los resultados obtenidos
              </p>
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>Tipo de vehiculo:</p>
              </Container>
              <PublicationsTypeVehicle setTypeVehicle={setTypeVehicle} />
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>Ordenar resultados por:</p>
              </Container>
              <PublicationsOrder setTypeOrder={setTypeOrder} />
            </Container>
            <Container className="pubications-options-bar">
              <Container>
                <p>Vehículo en:</p>
              </Container>
              <PublicationsStatusVehicle setTypeStatus={setTypeStatus} />
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
            />
          )}
        </Container>
      </Container>
    </Container>
  );
}
//
export default PublicationsPage;
