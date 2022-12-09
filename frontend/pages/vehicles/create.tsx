import "@/styles/custom/index.less";
import React, { useEffect, useState, useRef } from "react";
import { withAuth, useSession } from "auth";
import type { PageWithSession } from "types";
import type {
  VehicleGetSerializer,
  VehicleModelSerializer,
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
  models: VehicleModelSerializer[];
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
  Schema,
  Message,
} from "rsuite";

import { getCountries, getStates, getCities } from "pages/api/location";
import {
  getVehiclesBrands,
  getVehiclesModelsByBrand,
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

const Textarea = React.forwardRef((props, ref) => (
  <Input
    {...props}
    as="textarea"
    ref={ref}
    style={{ resize: "none", width: "100%" }}
    rows={10}
  />
));

const VehicleCreatePage: PageWithSession = () => {
  const toaster = useToaster();
  const vehicleModel = Schema.Model({
    continent: Schema.Types.StringType().isRequired("This field is required."),
    country: Schema.Types.NumberType().isRequired("This field is required."),
    state: Schema.Types.NumberType().isRequired("This field is required."),
    city: Schema.Types.NumberType().isRequired("This field is required."),
    contract_type: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    brand: Schema.Types.NumberType().isRequired("This field is required."),
    model: Schema.Types.NumberType().isRequired("This field is required."),
    location_zone: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    year: Schema.Types.NumberType().isRequired("This field is required."),
    status: Schema.Types.StringType().isRequired("This field is required."),
    type: Schema.Types.StringType().isRequired("This field is required."),
    details: Schema.Types.StringType().isRequired("This field is required."),
    exact_location: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    services: Schema.Types.StringType().isRequired("This field is required."),
    accessories: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    price: Schema.Types.NumberType().isRequired("This field is required."),
    currency: Schema.Types.NumberType().isRequired("This field is required."),
    contact_first_name: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    contact_last_name: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    contact_email: Schema.Types.StringType()
      .isRequired("This field is required.")
      .isEmail("This field must be an email."),
    contact_days: Schema.Types.ArrayType().minLength(1),
    contact_hour_from: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    contact_hour_from_system: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    contact_hour_to: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
    contact_hour_to_system: Schema.Types.StringType().isRequired(
      "This field is required."
    ),
  });
  const toasterPlacement = {
    placement: "bottomEnd",
  };
  const vehicleRef = useRef();

  const [vehicleState, setVehicleState] = useState<VehicleSerializer>({});
  const [mobileNumberState, setMobileNumberState] = useState(false);
  const [phoneNumberState, setPhoneNumberState] = useState(false);
  const [vehicleImagesState, setVehicleImagesState] = useState({});
  const [vehicleVideosState, setVehicleVideosState] = useState({});
  const [countriesState, setCountriesState] = useState<GeneralStateList[]>([]);
  const [statesState, setStatesState] = useState<GeneralStateList[]>([]);
  const [citiesState, setCitiesState] = useState<GeneralStateList[]>([]);
  const [vehicleBrandsState, setVehicleBrandsState] = useState([]);
  const [vehicleModelsState, setVehicleModelsState] = useState([]);
  const [vehicleTypesState, setVehicleTypesState] = useState(vehicleTypes);
  const [vehicleStatusState, setVehicleStatusState] = useState(vehicleStatus);
  const [currenciesState, setCurrenciesState] = useState([]);
  const [continentsState, setContinentsState] = useState(continents);
  const [yearsState, setYearsState] = useState([]);
  const [vehicleVideosList, setVehicleVideosList] = useState([]);
  const [vehicleImagesList, setVehicleImagesList] = useState([]);

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

    setVehicleVideosState((prevState) => ({ ...prevState, ...newFile }));
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
    if (
      !Object.values(vehicleImagesState).length ||
      !Object.values(vehicleVideosState).length ||
      !Object.values(vehicleVideosState).some(
        (video) => video != null || video != undefined
      ) ||
      !Object.values(vehicleImagesState).some(
        (image) => image != null || image != undefined
      )
    ) {
      toaster.push(
        <Message duration={6000} closable type="error">
          {"Debe agregar al menos una imagen y un video"}
        </Message>,
        toasterPlacement
      );
      return;
    }
    if (!vehicleRef?.current?.check()) return;

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

    if (vehicleVideosState) {
      let vehicleVideos = Object.values(vehicleVideosState);
      let vehicleVideosIndexes = Object.keys(vehicleVideosState);

      vehicleVideosIndexes.forEach((index, orderedIndex) => {
        vehicleFormData.append(
          `videos-${orderedIndex}-video`,
          vehicleVideosState[index][0].blobFile
        );
      });

      vehicleFormData.append("videos-INITIAL_FORMS", "0");
      vehicleFormData.append(
        "videos-TOTAL_FORMS",
        String(vehicleVideos.length)
      );
      vehicleFormData.append("videos-MAX_NUM_FORMS", "5");
      vehicleFormData.append("videos-MIN_NUM_FORMS", "0");
    }

    if (_vehicleState.contract_type == "RENTAL") {
      vehicleFormData.append("rental_price", _vehicleState.rental_price);
      vehicleFormData.append("sale_price", 0);
    } else if (_vehicleState.contract_type == "SALE") {
      vehicleFormData.append("sale_price", _vehicleState.sale_price);
      vehicleFormData.append("rental_price", 0);
    } else if (_vehicleState.contract_type == "RENTAL_SALE") {
      vehicleFormData.append("sale_price", _vehicleState.sale_price);
      vehicleFormData.append("rental_price", _vehicleState.rental_price);
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
        `misc-telephone-content_type-object_id-1-number`,
        _vehicleState.contact_mobile
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-1-country_number`,
        "123"
      );
      vehicleFormData.append(
        `misc-telephone-content_type-object_id-1-ptype`,
        "MOBILE"
      );
    }

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
      "2"
    );

    if (_vehicleState.year) {
      vehicleFormData.append(
        "year",
        dayjs().set("year", _vehicleState.year).format("YYYY-MM-DD")
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
    vehicleFormData.append("status", _vehicleState.status);
    vehicleFormData.append("exact_location", _vehicleState.exact_location);
    vehicleFormData.append("details", _vehicleState.details);

    vehicleFormData.append("type_vehicle", String(_vehicleState.type_vehicle));
    vehicleFormData.append(
      "init_publication_date",
      dayjs().format("YYYY-MM-DD")
    );
    vehicleFormData.append(
      "finish_publication_date",
      dayjs().format("YYYY-MM-DD")
    );

    const response = await createVehicle(vehicleFormData);

    if (response.success) {
      toaster.push(
        <Message duration={6000} closable type="success">
          {"El vehiculo se ha creado correctamente."}
        </Message>,
        toasterPlacement
      );
    } else {
      toaster.push(
        <Message duration={6000} closable type="error">
          {"Ha ocurrido un error al intentar crear el vehículo."}
        </Message>,
        toasterPlacement
      );
    }
  }

  function PhoneNumberSection() {
    if (phoneNumberState) {
      return (
        <FlexboxGrid>
          <PhoneInput
            label={"Phone"}
            style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
            className="phone-number-input"
            value={ vehicleState.contact_phone ?? '' }
            onChange={(_value: any) =>
              onChangeCreateVehicleRequest(_value, "contact_phone")
            }
          />
          <Input
            className="phone-text-input"
            value={ vehicleState.contact_phone_ext ?? '' }
            onChange={(_value: any) => {
              onChangeCreateVehicleRequest(_value, "contact_phone_ext");
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
          value={ vehicleState.contact_mobile ?? '' }
          onChange={(_value: any) => {
            onChangeCreateVehicleRequest(_value, "contact_mobile");
          }}
        />
      );
    }
    return null;
  }

  async function getInitialData() {
    vehicleRef?.current?.cleanErrors();
    let _vehicleImagesList = Array(20);
    let _vehicleVideosList = Array(5);

    _vehicleImagesList.fill(1);
    _vehicleVideosList.fill(1);

    setVehicleImagesList(_vehicleImagesList);
    setVehicleVideosList(_vehicleVideosList);

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

    const currencies = await getCurrencies();
    setCurrenciesState(
      currencies.map((currency: any) => ({
        label: `${currency.name} - ${currency.code}`,
        value: currency.id,
      }))
    );

    getYearsList(1970, parseInt(dayjs().format("YYYY")));
  }

  async function onChangeCountry(_countryId: number) {
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
    _vehicleState.location_city = _cityId;

    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
  }

  async function onChangeBrand(_brandId: number) {
    setVehicleModelsState(() => []);

    if (!_brandId) return;
    const vehicleModels = await getVehiclesModelsByBrand(String(_brandId));
    setVehicleModelsState(
      vehicleModels.map((model: any) => ({
        label: model.name,
        value: model.id,
      }))
    );
  }

  async function onChangeModel(_modelId: number) {
    const _vehicleState = vehicleState;
    _vehicleState.model = _modelId;
    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
  }

  function onChangeCreateVehicleRequest(_value: any, _field: string) {
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
        <Panel header={<h3>Crear publicación</h3>} bordered>
          <Form
            ref={vehicleRef}
            model={vehicleModel}
            onSubmit={onSubmitCreateVehicle}
          >
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
                        <Form.Control
                          name="continent"
                          placeholder="Selecciona un continente"
                          accepter={SelectPicker}
                          data={continentsState}
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
                        <Form.Control
                          name="country"
                          placeholder="Selecciona un país"
                          accepter={SelectPicker}
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
                        <Form.Control
                          name="state"
                          placeholder="Selecciona un estado"
                          accepter={SelectPicker}
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
                        <Form.Control
                          name="city"
                          accepter={SelectPicker}
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
                          name="location_zone"
                          style={{ maxWidth: "100%" }}
                          onChange={(_value: any) => {
                            onChangeCreateVehicleRequest(
                              _value,
                              "location_zone"
                            );
                          }}
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
                        <Form.Control
                          name="contract_type"
                          accepter={RadioGroup}
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
                        </Form.Control>
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
                        <Form.Control
                          name="brand"
                          placeholder="Selecciona una marca"
                          accepter={SelectPicker}
                          data={vehicleBrandsState}
                          onChange={onChangeBrand}
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
                        <Form.Control
                          name="model"
                          placeholder="Selecciona un modelo"
                          accepter={SelectPicker}
                          data={vehicleModelsState}
                          onChange={onChangeModel}
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
                        <Form.Control
                          name="year"
                          placeholder="Selecciona un año"
                          accepter={SelectPicker}
                          data={yearsState}
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "year")
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
                        <Form.Control
                          name="status"
                          placeholder="Selecciona un status"
                          accepter={SelectPicker}
                          data={vehicleStatusState}
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "status")
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
                        <Form.Control
                          name="type"
                          placeholder="Selecciona un tipo"
                          accepter={SelectPicker}
                          data={vehicleTypesState}
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(_value, "type_vehicle")
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
                  <div>
                    <p style={{ textAlign: "center", paddingTop: 32 }}>
                      Arrastre los videos que desea cargar en cada uno de los
                      recuadros
                    </p>
                    <Grid style={{ width: "100%" }}>
                      {vehicleVideosList.map((number, index) => (
                        <Col key={index} xs={6}>
                          <Uploader
                            multiple
                            fileList={vehicleVideosState[index] ?? null}
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
                      ))}
                    </Grid>
                  </div>
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
                  <Form.Control
                    name="details"
                    accepter={Textarea}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "details")
                    }
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
                  <Form.Control
                    name="exact_location"
                    accepter={Textarea}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "exact_location")
                    }
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
                  <Form.Control
                    name="services"
                    accepter={Textarea}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "services")
                    }
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
                  <Form.Control
                    name="accessories"
                    accepter={Textarea}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "accessories")
                    }
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col xs={10} xsPush={1}>
                  <Form.Group>
                    <Form.ControlLabel>Precio</Form.ControlLabel>
                    <Form.Control
                      name="price"
                      onChange={(_value: any) => {
                        if (vehicleState.contract_type === "RENTAL_SALE") {
                          onChangeCreateVehicleRequest(_value, "rental_price");
                          onChangeCreateVehicleRequest(_value, "sale_price");
                        }
                        if (vehicleState.contract_type === "RENTAL") {
                          onChangeCreateVehicleRequest(_value, "rental_price");
                          onChangeCreateVehicleRequest(0, "sale_price");
                        }
                        if (vehicleState.contract_type === "SALE") {
                          onChangeCreateVehicleRequest(0, "rental_price");
                          onChangeCreateVehicleRequest(_value, "sale_price");
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.ControlLabel>Moneda</Form.ControlLabel>
                    <Form.Control
                      name="currency"
                      placeholder="Selecciona una moneda"
                      accepter={SelectPicker}
                      onChange={(_value: any) => {
                        onChangeCreateVehicleRequest(_value, "currency");
                      }}
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
                      name="contact_first_name"
                      placeholder="Jesús Antonio"
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
                      name="contact_last_name"
                      placeholder="Perez Castillo"
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
                      name="contact_email"
                      placeholder="jesusp@test.com"
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
                    <Form.Control
                      name="contact_days"
                      accepter={CheckboxGroup}
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
                    </Form.Control>
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
                        <Form.Control
                          name="contact_hour_from"
                          placeholder="Selecciona una hora"
                          accepter={SelectPicker}
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "contact_hour_from"
                            )
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <Form.Control
                        name="contact_hour_from_system"
                        placeholder="am"
                        accepter={SelectPicker}
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
                        <Form.Control
                          name="contact_hour_to"
                          placeholder="Selecciona una hora"
                          accepter={SelectPicker}
                          onChange={(_value: any) =>
                            onChangeCreateVehicleRequest(
                              _value,
                              "contact_hour_to"
                            )
                          }
                          data={hours}
                        />
                      </Form.Group>
                      <Form.Control
                        name="contact_hour_to_system"
                        placeholder="am"
                        accepter={SelectPicker}
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
                    Guardar publicación
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

export default VehicleCreatePage;

export const getServerSideProps = withAuth({
  async getServerSideProps({ }) {
    return {
      props: {},
    };
  },
});
