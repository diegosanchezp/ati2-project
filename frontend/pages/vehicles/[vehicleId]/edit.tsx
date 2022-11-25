import "@/styles/custom/index.less";
import React, { useEffect, useState } from "react";
import { withAuth, useSession } from "auth";
import type { PageWithSession } from "types";

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
  getVehicle,
} from "pages/api/vehicle";
import { getCurrencies } from "pages/api/finance";
import dayjs from "dayjs";
import { useRouter } from "next/router";

type EditVehiclePageProps = {};

const VehicleEditPage: PageWithSession<EditVehiclePageProps> = (props) => {
  const toaster = useToaster();
  const router = useRouter();

  const continents = [
    {
      label: "Americas",
      value: "Americas",
    },
    {
      label: "Asia",
      value: "Asia",
    },
    {
      label: "Oceania",
      value: "Oceania",
    },
    {
      label: "Europe",
      value: "Europe",
    },
    {
      label: "Africa",
      value: "Africa",
    },
  ];

  const timeSystem = [
    {
      label: "AM",
      value: "am",
    },
    {
      label: "PM",
      value: "pm",
    },
  ];

  const hours = [
    {
      label: "01",
      value: "01",
    },
    {
      label: "02",
      value: "02",
    },
    {
      label: "03",
      value: "03",
    },
    {
      label: "04",
      value: "04",
    },
    {
      label: "05",
      value: "05",
    },
    {
      label: "06",
      value: "06",
    },
    {
      label: "07",
      value: "07",
    },
    {
      label: "08",
      value: "08",
    },
    {
      label: "09",
      value: "09",
    },
    {
      label: "10",
      value: "10",
    },
    {
      label: "11",
      value: "11",
    },
    {
      label: "12",
      value: "12",
    },
  ];

  const [mobileNumberState, setMobileNumberState] = React.useState(false);
  const [phoneNumberState, setPhoneNumberState] = React.useState(false);
  const [vehicleImagesState, setVehicleImagesState] = React.useState({});
  const [vehicleVideosState, setVehicleVideosState] = React.useState({});
  const [showVideosState, setShowVideosState] = React.useState(false);
  const [countriesState, setCountriesState] = React.useState([]);
  const [statesState, setStatesState] = React.useState([]);
  const [citiesState, setCitiesState] = React.useState([]);
  const [vehicleBrandsState, setVehicleBrandsState] = React.useState([]);
  const [vehicleModelsState, setVehicleModelsState] = React.useState([]);
  const [currenciesState, setCurrenciesState] = React.useState([]);
  const [createVehicleRequestState, setCreateVehicleRequestState] =
    React.useState({});
  const [continentsState, setContinentsState] = React.useState(continents);
  const [yearsState, setYearsState] = React.useState([]);

  function onInputVehicleImages(_fileList: Array<any>, _index: number) {
    const _file = _fileList.length > 0 ? _fileList[0] : null;
    let newFile = {};
    newFile[_index] = _file;
    setVehicleImagesState({ ...vehicleImagesState, ...newFile });
  }

  function onInputVehicleVideos(_fileList: Array<any>, _index: number) {
    const _file = _fileList.length > 0 ? _fileList[0] : null;
    let newFile = {};
    newFile[_index] = _file;
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

  function onUploadVehicleImages(_list: any) {
    setVehicleImagesState(_list);
  }

  function onUploadVehicleVideos(_list: any) {
    setVehicleVideosState(_list);
  }

  async function onSubmitCreateVehicle(
    checkStatus: boolean,
    _form: React.FormEvent<HTMLFormElement>
  ) {
    let _createVehicleRequest = createVehicleRequestState;

    if (vehicleImagesState) {
      const vehicleImages = Object.values(vehicleImagesState);
      let vehicleImagesReaders = [];
      if (vehicleImages.length > 0) {
        vehicleImages.forEach((image) => {
          let _reader = new FileReader();
          _reader.readAsDataURL(image.blobFile);
          _reader.onloadend = async () => {
            vehicleImagesReaders.push(_reader.result);
          };
        });
        _createVehicleRequest = {
          ..._createVehicleRequest,
          vehicle_images: vehicleImagesReaders,
        };
      }
    }

    if (_createVehicleRequest.contract_type == "RENTAL") {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        rental_price: _createVehicleRequest.price,
        sale_price: undefined,
      };
    } else if (_createVehicleRequest.contract_type == "SALE") {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        sale_price: _createVehicleRequest.price,
        rental_price: undefined,
      };
    } else if (_createVehicleRequest.contract_type == "RENTAL_SALE") {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        sale_price: _createVehicleRequest.price,
        rental_price: _createVehicleRequest.price,
      };
    } else {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        sale_price: undefined,
        rental_price: undefined,
      };
    }

    if (_createVehicleRequest.contact_days) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        contact_days: Object.values(_createVehicleRequest.contact_days),
      };
    }

    if (
      _createVehicleRequest.contact_hour_from &&
      _createVehicleRequest.contact_hour_from_system
    ) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        contact_hour_from: dayjs(
          `01-01-01 ${_createVehicleRequest.contact_hour_from}:00 ${_createVehicleRequest.contact_hour_from_system}`
        ).format("HH"),
      };
    }

    if (
      _createVehicleRequest.contact_hour_to &&
      _createVehicleRequest.contact_hour_to_system
    ) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        contact_hour_to: dayjs(
          `01-01-01 ${_createVehicleRequest.contact_hour_to}:00 ${_createVehicleRequest.contact_hour_to_system}`
        ).format("HH"),
      };
    }

    if (
      _createVehicleRequest.contact_phone &&
      _createVehicleRequest.contact_phone_ext
    ) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        contact_phone: `${_createVehicleRequest.contact_phone} ${_createVehicleRequest.contact_phone_ext}`,
      };
    }

    if (_createVehicleRequest.contact_days) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        contact_days: _createVehicleRequest.contact_days.join(","),
      };
    }

    if (_createVehicleRequest.year) {
      _createVehicleRequest = {
        ..._createVehicleRequest,
        year: dayjs()
          .set("year", _createVehicleRequest.year)
          .format("YYYY"),
      };
    }

    _createVehicleRequest = {
      ..._createVehicleRequest,
      owner: props.session.user.id,
      status: "NEW",
      accessories: "something",
      services: "something",
    };

    await createVehicle(_createVehicleRequest);
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
            specialLabel={"Phone"}
            style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
            inputClass="phone-number-input"
            onChange={(_value: any) =>
              onChangeCreateVehicleRequest(_value, "contact_phone")
            }
          />
          <Input
            className="phone-text-input"
            onChange={(_value: any) =>
              onChangeCreateVehicleRequest(_value, "contact_phone-ext")
            }
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
          specialLabel={"Mobile"}
          inputClass="phone-number-input"
          onChange={(_value: any) =>
            onChangeCreateVehicleRequest(_value, "contact_mobile")
          }
        />
      );
    }
    return null;
  }

  const toastOptions = {
    placement: "bottomCenter",
  };

  const [effectState, setEffectState] = useState("");

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
      currencies.map((currency: any) => ({
        label: `${currency.name} - ${currency.code}`,
        value: currency.id,
      }))
    );

    getYearsList(1970, parseInt(dayjs().format("YYYY")));

    const vehicleData = await getVehicle(`${router.query.vehicleId}`);
    console.log(vehicleData);
    if (vehicleData) {
      setCreateVehicleRequestState(() => ({
        ...vehicleData.vehicle,
        year: vehicleData.vehicle
          ? parseInt(dayjs(vehicleData.vehicle.year).format("YYYY"))
          : null,
        contact_hour_from: vehicleData.vehicle
          ? dayjs(`2022-01-01 ${vehicleData.vehicle.contact_hour_from}`).format(
              "HH"
            )
          : null,
        contact_hour_from_system: vehicleData.vehicle
          ? dayjs(`2022-01-01 ${vehicleData.vehicle.contact_hour_from}`).format(
              "a"
            )
          : null,
        contact_hour_to: vehicleData.vehicle
          ? dayjs(`2022-01-01 ${vehicleData.vehicle.contact_hour_to}`).format(
              "HH"
            )
          : null,
        contact_hour_to_system: vehicleData.vehicle
          ? dayjs(`2022-01-01 ${vehicleData.vehicle.contact_hour_to}`).format(
              "a"
            )
          : null,
      }));
      setCountriesState(() =>
        vehicleData.countries
          ? vehicleData.countries.map((country: any) => ({
              label: country.name,
              value: country.id,
            }))
          : []
      );
      setStatesState(() =>
        vehicleData.states
          ? vehicleData.states.map((state: any) => ({
              label: state.name,
              value: state.id,
            }))
          : []
      );
      setCitiesState(() =>
        vehicleData.cities
          ? vehicleData.cities.map((city: any) => ({
              label: city.name,
              value: city.id,
            }))
          : []
      );
    }
  }

  async function onChangeCountry(_countryId: number) {
    onChangeCreateVehicleRequest(_countryId, "location_country");
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
    onChangeCreateVehicleRequest(_stateId, "location_state");
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
    onChangeCreateVehicleRequest(_cityId, "location_city");
    if (_cityId)
      setCreateVehicleRequestState((prevState: any) => ({
        ...prevState,
        location_city: _cityId,
      }));
  }

  function onChangeCreateVehicleRequest(_value: any, _field: string) {
    let _createVehicleRequest = createVehicleRequestState;
    _createVehicleRequest[_field] = _value;
    setCreateVehicleRequestState((...prevState) => ({..._createVehicleRequest, ...prevState}));
  }

  function onChangeContactDays(_value: any) {
    setCreateVehicleRequestState((prevState: any) => ({
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
  }, [effectState]);

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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.location_continent
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "location_continent"
                            )
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.location_country
                              : null
                          }
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.location_state
                              : null
                          }
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.location_city
                              : null
                          }
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.location_zone
                              : ""
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "location_zone"
                            )
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.contract_type
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "contract_type"
                            )
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.brand
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "brand")
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.model
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "model")
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.year
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "year")
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
                          action=""
                          listType="picture"
                          accept=".jpg, .png, .svg"
                          className={
                            vehicleImagesState[index] != undefined &&
                            vehicleImagesState[index] != {} &&
                            vehicleImagesState[index] != null
                              ? "remove-file-input-uploader"
                              : ""
                          }
                          maxPreviewFileSize={6242880}
                          autoUpload={false}
                          disabled={
                            vehicleImagesState[index] != undefined &&
                            vehicleImagesState[index] != {} &&
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
                        value={showVideosState}
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
                    value={
                      createVehicleRequestState
                        ? createVehicleRequestState.details
                        : null
                    }
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "details")
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
                    value={
                      createVehicleRequestState
                        ? createVehicleRequestState.exact_location
                        : null
                    }
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "exact_location")
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
                      value={
                        createVehicleRequestState
                          ? createVehicleRequestState.sale_price ||
                            createVehicleRequestState.rental_price
                          : null
                      }
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(_value, "price")
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.ControlLabel>Moneda</Form.ControlLabel>
                    <SelectPicker
                      name="currency"
                      placeholder="Selecciona una moneda"
                      value={
                        createVehicleRequestState
                          ? createVehicleRequestState.currency
                          : null
                      }
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(_value, "currency")
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
                      value={
                        createVehicleRequestState
                          ? createVehicleRequestState.contact_first_name
                          : null
                      }
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(
                          _value,
                          "contact_first_name"
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Apellido</Form.ControlLabel>
                    <Form.Control
                      name="contactLastName"
                      placeholder="Perez Castillo"
                      value={
                        createVehicleRequestState
                          ? createVehicleRequestState.contact_last_name
                          : null
                      }
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(
                          _value,
                          "contact_last_name"
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Correo electrócnico</Form.ControlLabel>
                    <Form.Control
                      name="contactEmail"
                      placeholder="jesusp@test.com"
                      value={
                        createVehicleRequestState
                          ? createVehicleRequestState.contact_email
                          : null
                      }
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(_value, "contact_email")
                      }
                    />
                  </Form.Group>
                  <p style={{ paddingBottom: 16 }}>
                    Seleccione el o los teléfonos de su preferencia
                  </p>
                  <FlexboxGrid>
                    <Form.Group>
                      <Checkbox onChange={onChangeMobile} inline>
                        <span className="button button--yellow">Móvil</span>
                      </Checkbox>
                    </Form.Group>
                    <Form.Group>
                      <Checkbox onChange={onChangePhone} inline>
                        <span className="button button--yellow">Fijo</span>
                      </Checkbox>
                    </Form.Group>
                  </FlexboxGrid>
                  <section>
                    <PhoneNumberSection
                      onChange={(_value: any) =>
                        onChangeCreateVehicleRequest(_value, "contact_email")
                      }
                    />
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
                      value={createVehicleRequestState 
                        ? createVehicleRequestState.contact_days
                        : [] 
                      }
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.contact_hour_from
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "contact_hour_from"
                            )
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="startTimeSystem"
                        placeholder="am"
                        value={
                          createVehicleRequestState
                            ? createVehicleRequestState.contact_hour_from_system
                            : null
                        }
                        onChange={(_value: any) =>
                          onChangeCreateVehicleRequest(
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
                          value={
                            createVehicleRequestState
                              ? createVehicleRequestState.contact_hour_to
                              : null
                          }
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "contact_hour_to"
                            )
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="endTimeSystem"
                        placeholder="am"
                        value={
                          createVehicleRequestState
                            ? createVehicleRequestState.contact_hour_to_system
                            : null
                        }
                        onChange={(_value: any) =>
                          onChangeCreateVehicleRequest(
                            _value,
                            "contact_hour_to_system"
                          )
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
  countries: [];
}

export const getServerSideProps = withAuth<VehiclesPageProps>({
  async getServerSideProps({ user }) {
    return {
      props: {
        a: "a",
      },
    };
  },
});
