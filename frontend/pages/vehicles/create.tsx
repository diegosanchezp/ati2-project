import "@/styles/custom/index.less";
import React, { useEffect, useState } from "react";
import { withAuth, useSession } from "auth";
import type { PageWithSession } from "types";
import type {
  VehicleGetSerializer,
  VehicleSerializer as OriginalVehicleSerializer,
} from "djtypes/vehicle";
import type {
  CitiesSerializer,
  StatesSerializer,
  CountriesSerializer,
} from "djtypes/country";

type VehicleSerializer = OriginalVehicleSerializer & {
  countries: CountriesSerializer[];
  states: StatesSerializer[];
  cities: CitiesSerializer[];
  contact_hour_to_system?: string;
  contact_hour_from_system?: string;
};
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import {
  CheckboxGroup,
  Checkbox,
  Col,
  FlexboxGrid,
  Form,
  Grid,
  Input,
  Panel,
  Radio,
  RadioGroup,
  Row,
  SelectPicker,
  Uploader,
  useToaster,
} from "rsuite";

import { getCountries, getStates, getCities } from "pages/api/location";
import {
  getVehiclesBrands,
  getVehiclesModels,
  createVehicle,
} from "pages/api/vehicle";
import { getCurrencies } from "pages/api/finance";
import dayjs from "dayjs";
import {
  continents,
  timeSystem,
  hours,
  vehicleStatus,
  vehicleTypes,
} from "utils/vehicle-lists";

type GeneralStateList = {
  label: string;
  value: string;
};

const VehicleEditPage: PageWithSession = () => {
  const toaster = useToaster();

  const [vehicleState, setVehicleState] = React.useState<VehicleSerializer>({});
  const [mobileNumberState, setMobileNumberState] = React.useState(Boolean({}));
  const [phoneNumberState, setPhoneNumberState] = React.useState(Boolean({}));
  const [vehicleImagesState, setVehicleImagesState] = React.useState({});
  const [vehicleVideosState, setVehicleVideosState] = React.useState({});
  const [showVideosState, setShowVideosState] = React.useState(false);
  const [countriesState, setCountriesState] = React.useState<
    GeneralStateList[]
  >([]);
  const [statesState, setStatesState] = React.useState<GeneralStateList[]>([]);
  const [citiesState, setCitiesState] = React.useState<GeneralStateList[]>([]);
  const [vehicleBrandsState, setVehicleBrandsState] = React.useState([]);
  const [vehicleModelsState, setVehicleModelsState] = React.useState([]);
  const [vehicleTypesState, setVehicleTypesState] =
    React.useState(vehicleTypes);
  const [vehicleStatusState, setVehicleStatusState] =
    React.useState(vehicleStatus);
  const [currenciesState, setCurrenciesState] = React.useState([]);
  const [continentsState, setContinentsState] = React.useState(continents);
  const [yearsState, setYearsState] = React.useState([]);

  function onInputVehicleImages(_fileList: Array<any>, _index: number) {
    const _file = _fileList.length > 0 ? _fileList[0] : null;
    let newFile = {};
    newFile[_index] = _file ? [] : null;
    if (_file) newFile[_index].push(_file);

    setVehicleImagesState((prevState) => ({ ...prevState, ...newFile }));
  }

  function onInputVehicleVideos(_fileList: Array<any>, _index: number) {
    const _file = _fileList.length > 0 ? _fileList[0] : null;
    let newFile = {};
    newFile[_index] = _file ? [] : null;
    if (_file) newFile[_index].push(_file);

    setVehicleVideosState({ ...vehicleVideosState, ...newFile });
  }

  function onChangeShowVideos(_value: Boolean) {
    setShowVideosState(_value);
  }

  function onChangeMobile(_: any, checked: boolean) {
    setMobileNumberState(() => checked);
  }

  function onChangePhone(_: any, checked: boolean) {
    setPhoneNumberState(() => checked);
  }

  async function onSubmitCreateVehicle(
    checkStatus: boolean,
    _form: React.FormEvent<HTMLFormElement>
  ) {
    let _vehicleState = vehicleState;
    let vehicleFormData = new FormData();

    if (vehicleImagesState) {
      let vehicleImages = Object.values(vehicleImagesState);
      let vehicleImagesIndexes = Object.keys(vehicleImagesState);

      vehicleImagesIndexes.forEach((index, orderedIndex) => {
        vehicleFormData.append(
          `images-${orderedIndex}-image`,
          vehicleImagesState[index][0].blobFile
        );
      });

      vehicleFormData.append("images-INITIAL_FORMS", "0");
      vehicleFormData.append(
        "images-TOTAL_FORMS",
        String(vehicleImages.length)
      );
      vehicleFormData.append("images-MAX_NUM_FORMS", "20");
      vehicleFormData.append("images-MIN_NUM_FORMS", "0");
    }

    if (_vehicleState.contract_type == "RENTAL")
      vehicleFormData.append(
        "rental_price",
        String(_vehicleState.rental_price)
      );
    else if (_vehicleState.contract_type == "SALE")
      vehicleFormData.append("sale_price", String(_vehicleState.sale_price));
    else if (_vehicleState.contract_type == "RENTAL_SALE") {
      vehicleFormData.append("sale_price", String(_vehicleState.sale_price));
      vehicleFormData.append(
        "rental_price",
        String(_vehicleState.rental_price)
      );
    }

    if (_vehicleState.contact_days) {
      vehicleFormData.append(
        "contact_days",
        JSON.stringify(_vehicleState.contact_days)
      );
    }

    if (
      _vehicleState.contact_hour_from &&
      _vehicleState.contact_hour_from_system
    ) {
      console.log(
        `01-01-01 ${_vehicleState.contact_hour_from}:00:00 ${String(
          _vehicleState.contact_hour_from_system
        ).toLocaleUpperCase()}`
      );
      vehicleFormData.append(
        "contact_hour_from",
        dayjs(
          `01-01-01 ${_vehicleState.contact_hour_from}:00:00 ${String(
            _vehicleState.contact_hour_from_system
          ).toLocaleUpperCase()}`
        ).format("HH:mm:ss")
      );
    }

    if (_vehicleState.contact_hour_to && _vehicleState.contact_hour_to_system) {
      vehicleFormData.append(
        "contact_hour_to",
        dayjs(
          `01-01-01 ${_vehicleState.contact_hour_to}:00:00 ${String(
            _vehicleState.contact_hour_to_system
          ).toLocaleUpperCase()}`
        ).format("HH:mm:ss")
      );
    }

    if (_vehicleState.contact_phone) {
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-0-number`,
        _vehicleState.contact_phone
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-0-country_number`,
        "123"
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-0-ptype`,
        "FIXED"
      );
      if (_vehicleState.contact_phone_ext)
        vehicleFormData.append(
          `misc-telephone-content_type-object_id-0-ext`,
          String(_vehicleState.contact_phone_ext)
        );
    }

    if (_vehicleState.contact_mobile) {
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-${
          _vehicleState.contact_phone ? 1 : 0
        }-number`,
        _vehicleState.contact_phone
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-${
          _vehicleState.contact_phone ? 1 : 0
        }-country_number`,
        "123"
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-${
          _vehicleState.contact_phone ? 1 : 0
        }-ptype`,
        "MOBILE"
      );
    }

    let numberCount = 0;
    if (_vehicleState.contact_phone) numberCount++;
    if (_vehicleState.contact_mobile) numberCount++;

    vehicleFormData.append(
      `misc-telephone-content_type-object_id-INITIAL_FORMS`,
      "0"
    );
    vehicleFormData.append(
      `misc-telephone-content_type-object_id-MAX_NUM_FORMS`,
      "2"
    );
    vehicleFormData.append(
      `misc-telephone-content_type-object_id-MIN_NUM_FORMS`,
      "0"
    );
    vehicleFormData.append(
      `misc-telephone-content_type-object_id-TOTAL_FORMS`,
      String(numberCount)
    );

    if (_vehicleState.year) {
      vehicleFormData.append(
        "year",
        dayjs().set("year", Number(_vehicleState.year)).format("YYYY-MM-DD")
      );
    }

    vehicleFormData.append("accessories", String(_vehicleState.accessories));
    vehicleFormData.append("services", String(_vehicleState.services));
    vehicleFormData.append(
      "exac_location",
      String(_vehicleState.exact_location)
    );
    vehicleFormData.append("accessories", String(_vehicleState.details));
    vehicleFormData.append(
      "location_city",
      String(_vehicleState.location_city)
    );
    vehicleFormData.append(
      "location_zone",
      String(_vehicleState.location_zone)
    );
    vehicleFormData.append(
      "contact_first_name",
      String(_vehicleState.contact_first_name)
    );
    vehicleFormData.append(
      "contact_last_name",
      String(_vehicleState.contact_last_name)
    );
    vehicleFormData.append(
      "contact_email",
      String(_vehicleState.contact_email)
    );
    vehicleFormData.append(
      "contract_type",
      String(_vehicleState.contract_type)
    );
    vehicleFormData.append("currency", String(_vehicleState.currency));
    vehicleFormData.append("model", String(_vehicleState.model));
    vehicleFormData.append("brand", _vehicleState.brand);
    vehicleFormData.append("status", _vehicleState.status);
    vehicleFormData.append(
      "exact_location",
      String(_vehicleState.exact_location)
    );
    vehicleFormData.append("details", String(_vehicleState.details));

    vehicleFormData.append("type_vehicle", String(_vehicleState.type_vehicle));
    vehicleFormData.append(
      "init_publication_date",
      dayjs().format("YYYY-MM-DD")
    );
    vehicleFormData.append(
      "finish_publication_date",
      dayjs().format("YYYY-MM-DD")
    );

    for (const value of vehicleFormData.entries()) {
      console.log(value);
    }

    await createVehicle(vehicleFormData);
  }

  function onChangeVideosQuantity(_quantity: Number) {
    setVehicleVideosQuantity(_quantity);
    let _vehicleVideos = Array(_quantity);
    _vehicleVideos.fill(1);
    setVehicleVideosList(_vehicleVideos);
  }

  let vehicleImagesList = Array(20);
  const [vehicleVideosList, setVehicleVideosList] = React.useState([]);
  const [vehicleVideosQuantity, setVehicleVideosQuantity] = React.useState(1);

  vehicleImagesList.fill(1);

  let vehicleVideoQuantityList = [
    {
      label: 2,
      value: 2,
    },
    {
      label: 5,
      value: 5,
    },
  ];

  function PhoneNumberSection() {
    if (phoneNumberState) {
      return (
        <FlexboxGrid>
          <PhoneInput
            label={"Phone"}
            style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
            className="phone-number-input"
            onChange={(_value: any) =>
              onChangeVehicleState(_value, "contact_phone")
            }
          />
          <Input
            className="phone-text-input"
            onChange={(_value: any) => {
              onChangeVehicleState(_value, "contact_phone_ext");
            }}
          />
        </FlexboxGrid>
      );
    }
    return null;
  }

  function MobileNumberSection() {
    if (mobileNumberState) {
      return (
        <PhoneInput
          label={"Mobile"}
          className="phone-number-input"
          onChange={(_value: any) => {
            onChangeVehicleState(_value, "contact_mobile");
          }}
        />
      );
    }
    return null;
  }

  const toastOptions = {
    placement: "bottomCenter",
  };

  async function getInitialData() {
    const countries = await getCountries();
    setCountriesState(
      countries.map((country: any) => ({
        label: country.name,
        value: country.id,
      }))
    );

    const vehicleBrands = await getVehiclesBrands();
    setVehicleBrandsState(
      vehicleBrands.map((brand: any) => ({
        label: brand.name,
        value: brand.id,
      }))
    );

    const vehicleModels = await getVehiclesModels();
    setVehicleModelsState(
      vehicleModels.map((model: any) => ({
        label: model.name,
        value: model.id,
      }))
    );

    const currencies = await getCurrencies();
    setCurrenciesState(
      currencies.map((currency) => ({
        label: `${currency.name} - ${currency.code}`,
        value: currency.id,
      }))
    );

    getYearsList(1970, parseInt(dayjs().format("YYYY")));
  }

  async function onChangeCountry(_countryId: number) {
    const _vehicleState = vehicleState;
    _vehicleState.location_city.state.country.id = _countryId;
    _vehicleState.location_city.state.id = undefined;
    _vehicleState.location_city.id = undefined;

    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
    setStatesState(() => []);
    setCitiesState(() => []);

    if (_countryId) {
      const states = await getStates(_countryId);
      setStatesState(
        states.map((state: any) => ({
          label: state.name,
          value: state.id,
        }))
      );
    }
  }

  async function onChangeState(_stateId: number) {
    const _vehicleState = vehicleState;
    _vehicleState.location_city.state.id = _stateId;
    _vehicleState.location_city.id = undefined;

    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
    setCitiesState(() => []);

    if (_stateId) {
      const cities = await getCities(_stateId);
      setCitiesState(
        cities.map((city: any) => ({
          label: city.name,
          value: city.id,
        }))
      );
    }
  }

  async function onChangeCity(_cityId: number) {
    const _vehicleState = vehicleState;
    _vehicleState.location_city.id = _cityId;

    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
    if (_cityId)
      setVehicleState((prevState: any) => ({
        ...prevState,
        location_city: _cityId,
      }));
  }

  function onChangeVehicleState(_value: any, _field: string) {
    let _vehicleState = vehicleState;
    _vehicleState[_field] = _value;
    setVehicleState((prevState: any) => ({
      ...prevState,
      ..._vehicleState,
    }));
  }

  function onChangeContactDays(_value: any) {
    setVehicleState((prevState: any) => ({
      ...prevState,
      contact_days: _value,
    }));
  }

  function getYearsList(_from: number, _to: number) {
    let _maxYear = _to;
    let _yearList = [];

    for (let _minYear = _from; _minYear <= _maxYear; _minYear++) {
      _yearList.push({ label: _minYear, value: _minYear });
    }

    setYearsState(() => _yearList);
  }

  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <FlexboxGrid
      justify="center"
      style={{ marginTop: 40, paddingRight: 20, paddingLeft: 20 }}
    >
      <FlexboxGrid.Item colspan={12} style={{ width: "100%" }}>
        <Panel header={<h3>Editar publicación</h3>} bordered>
          <Form onSubmit={onSubmitCreateVehicle}>
            <Grid>
              <Row gutter={16} style={{ marginBottom: 32 }}>
                <FlexboxGrid justify="center">
                  <p
                    className="button button--yellow"
                    style={{ marginBottom: 16 }}
                  >
                    Ubicación del vehículo
                  </p>
                </FlexboxGrid>
                <Grid>
                  <Row gutter={16}>
                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Continente
                        </Form.ControlLabel>
                        <SelectPicker
                          name="continent"
                          placeholder="Selecciona un continente"
                          data={continentsState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "location_continent")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          País
                        </Form.ControlLabel>
                        <SelectPicker
                          name="country"
                          placeholder="Selecciona un país"
                          data={countriesState}
                          onChange={onChangeCountry}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Estado
                        </Form.ControlLabel>
                        <SelectPicker
                          name="state"
                          placeholder="Selecciona un estado"
                          data={statesState}
                          onChange={onChangeState}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Ciudad
                        </Form.ControlLabel>
                        <SelectPicker
                          name="city"
                          placeholder="Selecciona una ciudad"
                          data={citiesState}
                          onChange={onChangeCity}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Zona
                        </Form.ControlLabel>
                        <Form.Control
                          name="zone"
                          style={{ maxWidth: "100%" }}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "location_zone")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Vehículo en
                        </Form.ControlLabel>
                        <RadioGroup
                          name="contract"
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "contract_type")
                          }
                        >
                          <Radio value={"RENTAL"}>Alquiler</Radio>
                          <Radio value={"SALE"}>Venta</Radio>
                          <Radio value={"RENTAL_SALE"}>Alquiler y venta</Radio>
                        </RadioGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Grid>

                <FlexboxGrid justify="center">
                  <p
                    className="button button--yellow"
                    style={{ marginBottom: 16 }}
                  >
                    Marca, modelo y año del vehículo
                  </p>
                </FlexboxGrid>

                <Grid>
                  <Row gutter={16}>
                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Marca de vehículo
                        </Form.ControlLabel>
                        <SelectPicker
                          name="brand"
                          placeholder="Selecciona una marca"
                          data={vehicleBrandsState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "brand")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Modelo vehiculo
                        </Form.ControlLabel>
                        <SelectPicker
                          name="model"
                          placeholder="Selecciona un modelo"
                          data={vehicleModelsState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "model")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Año de vehículo
                        </Form.ControlLabel>
                        <SelectPicker
                          name="year"
                          placeholder="Selecciona un año"
                          data={yearsState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "year")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Status de vehículo
                        </Form.ControlLabel>
                        <SelectPicker
                          name="status"
                          placeholder="Selecciona un status"
                          data={vehicleStatusState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "status")
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={4}>
                      <Form.Group>
                        <Form.ControlLabel
                          className="button button--blue"
                          style={{ marginBottom: 16, textAlign: "start" }}
                        >
                          Tipo de vehículo
                        </Form.ControlLabel>
                        <SelectPicker
                          name="type"
                          placeholder="Selecciona un tipo"
                          data={vehicleTypesState}
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "type_vehicle")
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Grid>
              </Row>

              <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col xs={16}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Fotos del vehículo
                    </p>
                  </FlexboxGrid>
                  <Grid style={{ width: "100%" }}>
                    {vehicleImagesList.map((number, index) => (
                      <Col key={index} xs={3}>
                        <Uploader
                          name="vehicleImages[]"
                          multiple
                          fileList={vehicleImagesState[index] ?? null}
                          action=""
                          listType="picture"
                          accept=".jpg, .png, .svg"
                          className={
                            vehicleImagesState[index] != undefined &&
                            vehicleImagesState[index] != {} &&
                            vehicleImagesState[index] != [] &&
                            vehicleImagesState[index] != null
                              ? "remove-file-input-uploader"
                              : ""
                          }
                          maxPreviewFileSize={6242880}
                          autoUpload={false}
                          disabled={
                            vehicleImagesState[index] != undefined &&
                            vehicleImagesState[index] != {} &&
                            vehicleImagesState[index] != [] &&
                            vehicleImagesState[index] != null
                          }
                          onChange={(_fileList: Array<any>) =>
                            onInputVehicleImages(_fileList, index)
                          }
                        >
                          <section
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CameraRetroIcon />
                          </section>
                        </Uploader>
                      </Col>
                    ))}
                  </Grid>
                </Col>
                <Col xs={8}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      ¿Desea agregar videos?
                    </p>
                  </FlexboxGrid>
                  <Grid style={{ width: "100%" }}>
                    <FlexboxGrid justify="center">
                      <RadioGroup
                        inline
                        name="radio-name"
                        onChange={onChangeShowVideos}
                      >
                        <Radio value={true}>Si</Radio>
                        <Radio value={false}>No</Radio>
                      </RadioGroup>
                    </FlexboxGrid>
                    {showVideosState ? (
                      <FlexboxGrid justify="center">
                        <p className="button button--blue">
                          Cantidad de videos
                        </p>
                        <SelectPicker
                          data={vehicleVideoQuantityList}
                          onChange={onChangeVideosQuantity}
                          style={{ marginLeft: 16 }}
                        />
                      </FlexboxGrid>
                    ) : null}

                    {showVideosState ? (
                      <p style={{ textAlign: "center", paddingTop: 32 }}>
                        Arrastre los videos que desea cargar en cada uno de los
                        recuadros
                      </p>
                    ) : null}
                    {showVideosState
                      ? vehicleVideosList.map((number, index) => (
                          <Col key={index} xs={24 / vehicleVideosQuantity}>
                            <Uploader
                              name="vehicleImages"
                              multiple
                              action=""
                              listType="picture"
                              accept=".mp4"
                              className={
                                vehicleVideosState[index] != undefined &&
                                vehicleVideosState[index] != {} &&
                                vehicleVideosState[index] != null
                                  ? "remove-file-input-uploader"
                                  : ""
                              }
                              maxPreviewFileSize={6242880}
                              autoUpload={false}
                              disabled={
                                vehicleVideosState[index] != undefined &&
                                vehicleVideosState[index] != {} &&
                                vehicleVideosState[index] != null
                              }
                              onChange={(_fileList: Array<any>) =>
                                onInputVehicleVideos(_fileList, index)
                              }
                            >
                              <section
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CameraRetroIcon />
                              </section>
                            </Uploader>
                          </Col>
                        ))
                      : null}
                  </Grid>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col xs={16}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Otros detalles sobre el vehículo
                    </p>
                  </FlexboxGrid>
                  <Input
                    name="moreDetails"
                    as="textarea"
                    onChange={(_value: any) =>
                      onChangeVehicleState(_value, "details")
                    }
                    rows={10}
                    style={{ resize: "none" }}
                  />
                </Col>

                <Col xs={8}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Ubicación exacta
                    </p>
                  </FlexboxGrid>
                  <Input
                    name="location"
                    as="textarea"
                    onChange={(_value: any) =>
                      onChangeVehicleState(_value, "exact_location")
                    }
                    rows={10}
                    style={{ resize: "none" }}
                  />
                </Col>

                <Col xs={16} style={{ marginTop: 32 }}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Servicios
                    </p>
                  </FlexboxGrid>
                  <Input
                    name="moreDetails"
                    as="textarea"
                    onChange={(_value: any) =>
                      onChangeVehicleState(_value, "services")
                    }
                    rows={10}
                    style={{ resize: "none" }}
                  />
                </Col>

                <Col xs={8} style={{ marginTop: 32 }}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Accesorios
                    </p>
                  </FlexboxGrid>
                  <Input
                    name="location"
                    as="textarea"
                    onChange={(_value: any) =>
                      onChangeVehicleState(_value, "accessories")
                    }
                    rows={10}
                    style={{ resize: "none" }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col xs={10} xsPush={1}>
                  <Form.Group>
                    <Form.ControlLabel>Precio</Form.ControlLabel>
                    <Form.Control
                      name="price"
                      type="number"
                      onChange={(_value: any) => {
                        if (vehicleState.contract_type === "RENTAL_SALE") {
                          onChangeVehicleState(_value, "rental_price");
                          onChangeVehicleState(_value, "sale_price");
                        }
                        if (vehicleState.contract_type === "RENTAL") {
                          onChangeVehicleState(_value, "rental_price");
                          onChangeVehicleState(null, "sale_price");
                        }
                        if (vehicleState.contract_type === "SALE") {
                          onChangeVehicleState(null, "rental_price");
                          onChangeVehicleState(_value, "sale_price");
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.ControlLabel>Moneda</Form.ControlLabel>
                    <SelectPicker
                      name="currency"
                      placeholder="Selecciona una moneda"
                      onChange={(_value: any) =>
                        onChangeVehicleState(_value, "currency")
                      }
                      data={currenciesState}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col
                  xs={12}
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                  }}
                >
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Información de contacto
                    </p>
                  </FlexboxGrid>
                  <Form.Group>
                    <Form.ControlLabel>Nombre</Form.ControlLabel>
                    <Form.Control
                      name="contactName"
                      placeholder="Jesús Antonio"
                      onChange={(_value: any) =>
                        onChangeVehicleState(_value, "contact_first_name")
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Apellido</Form.ControlLabel>
                    <Form.Control
                      name="contactLastName"
                      placeholder="Perez Castillo"
                      onChange={(_value: any) =>
                        onChangeVehicleState(_value, "contact_last_name")
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Correo electrócnico</Form.ControlLabel>
                    <Form.Control
                      name="contactEmail"
                      placeholder="jesusp@test.com"
                      onChange={(_value: any) =>
                        onChangeVehicleState(_value, "contact_email")
                      }
                    />
                  </Form.Group>
                  <p style={{ paddingBottom: 16 }}>
                    Seleccione el o los teléfonos de su preferencia
                  </p>
                  <FlexboxGrid>
                    <Form.Group>
                      <Checkbox
                        onChange={onChangeMobile}
                        checked={mobileNumberState}
                        inline
                      >
                        <span className="button button--yellow">Móvil</span>
                      </Checkbox>
                    </Form.Group>
                    <Form.Group>
                      <Checkbox
                        onChange={onChangePhone}
                        checked={phoneNumberState}
                        inline
                      >
                        <span className="button button--yellow">Fijo</span>
                      </Checkbox>
                    </Form.Group>
                  </FlexboxGrid>
                  <section>
                    <PhoneNumberSection />
                    <MobileNumberSection />
                  </section>
                </Col>
                <Col xs={12}>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16 }}
                    >
                      Días de contacto
                    </p>
                  </FlexboxGrid>

                  <FlexboxGrid justify="center">
                    <CheckboxGroup
                      onChange={(_value: any) => onChangeContactDays(_value)}
                    >
                      <Grid style={{ width: "auto" }}>
                        <Col xs={6}>
                          <Checkbox value="monday">Lunes</Checkbox>
                          <Checkbox value="friday">Viernes</Checkbox>
                        </Col>
                        <Col xs={6}>
                          <Checkbox value="tuesday">Martes</Checkbox>
                          <Checkbox value="saturday">Sábado</Checkbox>
                        </Col>
                        <Col xs={6}>
                          <Checkbox value="wednesday">Miércoles</Checkbox>
                          <Checkbox value="sunday">Domingo</Checkbox>
                        </Col>
                        <Col xs={6}>
                          <Checkbox value="thursday">Jueves</Checkbox>
                        </Col>
                      </Grid>
                    </CheckboxGroup>
                  </FlexboxGrid>
                  <FlexboxGrid justify="center">
                    <p
                      className="button button--yellow"
                      style={{ marginBottom: 16, marginTop: 16 }}
                    >
                      Horas de contacto
                    </p>
                  </FlexboxGrid>
                  <FlexboxGrid justify="center">
                    <FlexboxGrid
                      align="middle"
                      justify="center"
                      style={{ width: "100%" }}
                    >
                      <Form.Group>
                        <Form.ControlLabel>Desde</Form.ControlLabel>
                        <SelectPicker
                          name="startContactTime"
                          placeholder="Selecciona una hora"
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "contact_hour_from")
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="startTimeSystem"
                        placeholder="am"
                        onChange={(_value: any) =>
                          onChangeVehicleState(
                            _value,
                            "contact_hour_from_system"
                          )
                        }
                        data={timeSystem}
                        style={{ marginLeft: 8, width: 100 }}
                      />
                    </FlexboxGrid>
                    <FlexboxGrid
                      align="middle"
                      justify="center"
                      style={{ width: "100%" }}
                    >
                      <Form.Group>
                        <Form.ControlLabel>Hasta</Form.ControlLabel>
                        <SelectPicker
                          name="endContactTime"
                          placeholder="Selecciona una hora"
                          onChange={(_value: any) =>
                            onChangeVehicleState(_value, "contact_hour_to")
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="endTimeSystem"
                        placeholder="am"
                        onChange={(_value: any) =>
                          onChangeVehicleState(_value, "contact_hour_to_system")
                        }
                        data={timeSystem}
                        style={{ marginLeft: 8, width: 100 }}
                      />
                    </FlexboxGrid>
                  </FlexboxGrid>
                </Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <FlexboxGrid justify="center">
                  <button type="submit" className="button button--yellow">
                    Modificar publicación
                  </button>
                  <button
                    className="button button--yellow"
                    style={{ marginLeft: 16 }}
                  >
                    Cancelar
                  </button>
                </FlexboxGrid>
              </Row>
            </Grid>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default VehicleEditPage;

interface VehiclesPageProps {
  // countries: [];
}

export const getServerSideProps = withAuth({
  async getServerSideProps({}) {
    return {
      props: {},
    };
  },
});
