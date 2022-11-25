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

function PublicationsPage() {
  const [typeVisualizer, setTypeVisualizer] = useState(
    TypeVisualizerEnum.PHOTO
  );
  const [typeVehicle, setTypeVehicle] = useState(TypeVehicleEnum.ALL);
  const [typeOrder, setTypeOrder] = useState(TypeOrderPubliationsEnum.PRECIO);
  const [typeStatus, setTypeStatus] = useState(TypeStatusVehicleEnum.ALL);
  const [activePage, setActivePage] = useState(1);
  const [cardsSelected, setCardsSelected] = useState([]);
  const [lastCard, setLastCard] = useState(0);

  //estados 5 botones
  const [optionsButtons, setOptionsButtons] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  /*useEffect(() => {
    const isPhoto = typeVisualizer === TypeVisualizerEnum.PHOTO;
    if (isPhoto) {
      setTypeVisualizer(TypeVisualizerEnum.LIST);
    } else {
      setTypeVisualizer(TypeVisualizerEnum.PHOTO);
    }
  }, [typeVisualizer]);*/
  useEffect(() => {
    //3 casos
    const isClient = false;
    const isAdmin = true;
    const isLogin = true;
    console.log("en effect ", cardsSelected);
    const len = cardsSelected.length;

    const activeButtons = len === 1;
    if (activeButtons) {
      console.log("tengo que activar botones");
      const seeButton = true;
      const editButton = isLogin && isClient;
      const disableButton = isLogin && (isAdmin || isClient);
      const ableButton = isLogin && (isAdmin || isClient);
      const deleteButton = isLogin && (isAdmin || isClient);
      setOptionsButtons([
        !seeButton,
        !editButton,
        !disableButton,
        !ableButton,
        !deleteButton,
      ]);
    } else {
      setOptionsButtons([true, true, true, true, true]);
    }
    console.log("----------------------------------");
  }, [lastCard]);
  const data = [
    "Eugenia",
    "Bryan",
    "Linda",
    "Nancy",
    "Lloyd",
    "Alice",
    "Julia",
    "Albert",
    "Louisa",
    "Lester",
    "Lola",
    "Lydia",
    "Hal",
    "Hannah",
    "Harriet",
    "Hattie",
    "Hazel",
    "Hilda",
  ].map((item) => ({ label: item, value: item }));

  return (
    <Container id="publications-panel">
      <Container id="publications-search">
        <PanelGroup accordion defaultActiveKey={1} bordered>
          <Panel
            header="Busqueda rápida"
            eventKey={1}
            id="panel-busqueda-rapida"
          >
            <SelectPicker
              label="Continente"
              data={data}
              style={{ width: 224 }}
              searchable={false}
              virtualized
            />
            <CheckPicker
              label="Pais"
              data={data}
              style={{ width: 224 }}
              virtualized
              searchable={false}
            />
            <CheckPicker
              label="Estado"
              data={data}
              style={{ width: 224 }}
              virtualized
              searchable={false}
            />
            <SelectPicker
              label="Vehículo en"
              data={data}
              style={{ width: 224 }}
              searchable={false}
              virtualized
            />
            <SelectPicker
              label="Marca"
              data={data}
              style={{ width: 224 }}
              searchable={false}
              virtualized
            />
            <SelectPicker
              disabled
              label="Modelo"
              data={data}
              style={{ width: 224 }}
              searchable={false}
              virtualized
            />
            <Container>
              <Button size="sm" color="blue" appearance="primary">
                Buscar
              </Button>
              <Button size="sm" color="orange" appearance="primary">
                Cancelar
              </Button>
            </Container>
          </Panel>
          <Panel header="Busqueda detallada" eventKey={2} id="panel2">
            <Form>
              <SelectPicker
                label="Continente"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
              <CheckPicker
                label="Pais"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
              />
              <CheckPicker
                label="Estado"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
              />
              <CheckPicker
                label="Ciudad"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
              />
              <CheckPicker
                label="Zona"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
              />
              <SelectPicker
                label="Vehículo en"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
              <SelectPicker
                label="Marca"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
              <SelectPicker
                disabled
                label="Modelo"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
              <p>quiero ver????????</p>
              <Container>
                <p>Moneda</p>
              </Container>
              <Container>
                <p>Precio</p>
                <RadioGroup name="radioList">
                  <Radio value="A" checked={true}>
                    Por rango
                  </Radio>
                  <Form.Group controlId="min-price">
                    <Form.ControlLabel>Min</Form.ControlLabel>
                    <Form.Control
                      size="sm"
                      name="min-price"
                      type="number"
                      style={{ width: 224 }}
                    />
                  </Form.Group>
                  <Form.Group controlId="max-price">
                    <Form.ControlLabel>Max</Form.ControlLabel>
                    <Form.Control
                      size="sm"
                      name="max-price"
                      type="number"
                      style={{ width: 224 }}
                    />
                  </Form.Group>
                  <Radio value="B" checked={false}>
                    Cualquier precio
                  </Radio>
                </RadioGroup>
              </Container>
              <Container>
                <p>Listar resultados de forma</p>
                <RadioGroup name="radioList">
                  <Radio value="A" checked={true}>
                    Mayor a menor
                  </Radio>
                  <Radio value="B" checked={false}>
                    Menor a mayor
                  </Radio>
                  <Radio value="C" checked={false}>
                    Más recomendados
                  </Radio>
                </RadioGroup>
              </Container>
              <Container>
                <Button size="sm" color="blue" appearance="primary">
                  Buscar
                </Button>
                <Button size="sm" color="orange" appearance="primary">
                  Cancelar
                </Button>
              </Container>
            </Form>
          </Panel>
        </PanelGroup>
      </Container>

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
        <Container id="publications-pagination">
          <Pagination
            prev
            last
            next
            first
            size="md"
            total={100}
            limit={90}
            activePage={activePage}
            onChangePage={setActivePage}
          />
        </Container>
        <Divider />
        <Container>
          {typeVisualizer === TypeVisualizerEnum.PHOTO ? (
            <PublicationPhoto
              cardSelected={cardsSelected}
              setCardSelected={setCardsSelected}
              setLastCard={setLastCard}
              lastCard={lastCard}
            />
          ) : (
            <PublicationList
              cardSelected={cardsSelected}
              setCardSelected={setCardsSelected}
              setLastCard={setLastCard}
              lastCard={lastCard}
            />
          )}
        </Container>
      </Container>
    </Container>
  );
}
//
export default PublicationsPage;
