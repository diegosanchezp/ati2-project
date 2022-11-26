import React, { useState } from "react";
import { useRouter } from "next/router";
import { djRequest, getCSRF } from "utils/apirest";
import { ChangeLanguageBody } from "djtypes/auth";
import {
  Container,
  Header,
  Content,
  Navbar,
  Nav,
  Button,
  CheckPicker,
  PanelGroup,
  Panel,
  SelectPicker,
  Form,
  RadioGroup,
  Radio,
} from "rsuite";
import { routes } from "utils/routes";
import { useSession } from "auth";

import { useTranslations } from "next-intl";

import { NavLink } from "components/NavLink";
import { Dropdown } from "rsuite";
export type LayoutProps = {
  children: React.ReactNode;
};

function FilterVehicles(props: any) {
  //states a recibir
  const {
    state,
    setStates,
    continent,
    setContinent,
    setSubmit,
    setCleanStatesQuery,
    cleanStatesQuery,
  } = props.queryFilter;
  const [rangePrice, setRangePrice] = useState(false);

  //dummy date
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

  async function handleSubmit(
    checkStatus: boolean,
    e: React.FormEvent<HTMLFormElement>
  ) {
    // Stop the form from submitting and refreshing the page.
    //console.log("event ", event);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    console.log("state from submit", state);
    props.setSubmit(true);
  }
  //reiniciamos los states de este filtro
  function cleanSearch(e) {
    setStates([]);
    setContinent("");
  }

  function changeContinent(e) {
    setContinent(e);
  }
  function changeStates(e) {
    setStates(e);
    console.log("states from change states ", state);
  }

  function changePriceType(e) {
    if (e === "RANGE") {
      setRangePrice(true);
    }
    if (e === "ANY") {
      setRangePrice(false);
    }
  }

  return (
    <Container id="publications-search">
      <PanelGroup accordion defaultActiveKey={1} bordered>
        <Panel header="Busqueda rápida" eventKey={1} id="panel-busqueda-rapida">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <SelectPicker
                label="Continente"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
                value={continent}
                onChange={changeContinent}
              />
            </Form.Group>

            <Form.Group>
              <CheckPicker
                label="Pais"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
              />
            </Form.Group>
            <Form.Group>
              <CheckPicker
                label="Estados"
                data={data}
                style={{ width: 224 }}
                virtualized
                searchable={false}
                value={state}
                onChange={changeStates}
              />
            </Form.Group>
            <Form.Group>
              <SelectPicker
                label="Vehículo en"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
            </Form.Group>
            <Form.Group>
              {" "}
              <SelectPicker
                label="Marca"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
            </Form.Group>
            <Form.Group>
              <SelectPicker
                label="Modelo"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
            </Form.Group>

            <Container>
              <Button type="submit" size="sm" color="blue" appearance="primary">
                Buscar
              </Button>
            </Container>
          </Form>
          <Button
            size="sm"
            color="orange"
            appearance="primary"
            onClick={cleanSearch}
          >
            Cancelar
          </Button>
        </Panel>
        <Panel header="Busqueda detallada" eventKey={2} id="panel2">
          <Form onSubmit={handleSubmit}>
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
            <Form.Group>
              <SelectPicker
                label="Quiero ver"
                data={data}
                style={{ width: 224 }}
                searchable={false}
                virtualized
              />
            </Form.Group>
            <Container>
              <p>Moneda</p>
            </Container>
            <Container>
              <p>Precio</p>
              <RadioGroup name="radioList">
                <Radio value="RANGE" checked={true} onChange={changePriceType}>
                  Por rango
                </Radio>
                <Form.Group controlId="min-price">
                  <Form.ControlLabel>Min</Form.ControlLabel>
                  <Form.Control
                    size="sm"
                    name="min-price"
                    type="number"
                    disabled={!rangePrice}
                    style={{ width: 224 }}
                  />
                </Form.Group>
                <Form.Group controlId="max-price">
                  <Form.ControlLabel>Max</Form.ControlLabel>
                  <Form.Control
                    size="sm"
                    name="max-price"
                    type="number"
                    disabled={!rangePrice}
                    style={{ width: 224 }}
                  />
                </Form.Group>
                <Radio value="ANY" checked={false} onChange={changePriceType}>
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
              <Button type="submit" size="sm" color="blue" appearance="primary">
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
  );
}

export default FilterVehicles;
