import "@/styles/custom/index.less";
import React, { useEffect, useState } from "react";
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
} from "rsuite";

import { getCountries, getStates, getCities } from "pages/api/location";
import {
  getVehiclesBrands,
  getVehiclesModelsByBrand,
  editVehicle,
} from "pages/api/vehicle";
import { getCurrencies } from "pages/api/finance";
import dayjs from "dayjs";
import { djRequest, getCSRF } from "utils/apirest";
import {
  continents,
  timeSystem,
  hours,
  vehicleStatus,
  vehicleTypes,
} from "utils/vehicle-lists";

type EditVehiclePageProps = {
  vehicleData: VehicleSerializer;
  user: any;
};

type GeneralStateList = {
  label: string;
  value: string;
};

const VehicleEditPage: PageWithSession<EditVehiclePageProps> = (props) => {
  const toaster = useToaster();
  const { vehicleData, user } = props;

  const [vehicleState, setVehicleState] =
    React.useState<VehicleSerializer>(vehicleData);
  const [mobileNumberState, setMobileNumberState] = React.useState(
    Boolean(getVehicleNumberPhone("MOBILE"))
  );
  const [phoneNumberState, setPhoneNumberState] = React.useState(
    Boolean(getVehicleNumberPhone("FIXED"))
  );
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
  const [vehicleVideosList, setVehicleVideosList] = React.useState([]);
  const [vehicleImagesList, setVehicleImagesList] = React.useState([]);
  const [vehicleVideosQuantity, setVehicleVideosQuantity] = React.useState(1);

  function onInputVehicleImages(_fileList: Array<any>, _index: number) {
    const _file = _fileList.length > 0 ? _fileList[0] : null;
    let newFile = {};
    if (!vehicleImagesState[_index]) _file = { ..._file, isNew: true };
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

  async function onSubmitEditVehicle(
    checkStatus: boolean,
    _form: React.FormEvent<HTMLFormElement>
  ) {
    let _vehicleState = vehicleState;
    let vehicleFormData = new FormData();

    if (vehicleImagesState) {
      let vehicleImages = Object.values(vehicleImagesState);
      let vehicleImagesIndexes = Object.keys(vehicleImagesState);

      vehicleImagesIndexes.forEach((index, orderedIndex) => {
        if (vehicleImagesState[index]) {
          if (
            vehicleData.images[`${vehicleData.images.prefix}-${index}-id`] !=
              undefined &&
            vehicleData.images[`${vehicleData.images.prefix}-${index}-id`] !=
              null
          ) {
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-id`,
              vehicleData.images[`${vehicleData.images.prefix}-${index}-id`]
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-image`,
              vehicleImagesState[index][0].blobFile
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-DELETE`,
              ""
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-vehicle`,
              vehicleData.images[
                `${vehicleData.images.prefix}-${index}-vehicle`
              ]
            );
          } else {
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-image`,
              vehicleImagesState[index][0].blobFile
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-vehicle`,
              String(vehicleData.id)
            );
          }
        } else {
          if (vehicleData.images[`${vehicleData.images.prefix}-${index}-id`]) {
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-id`,
              vehicleData.images[`${vehicleData.images.prefix}-${index}-id`]
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-image`,
              vehicleData.images[`${vehicleData.images.prefix}-${index}-image`]
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-DELETE`,
              "True"
            );
            vehicleFormData.append(
              `${vehicleData.images.prefix}-${orderedIndex}-vehicle`,
              vehicleData.images[
                `${vehicleData.images.prefix}-${index}-vehicle`
              ]
            );
          }
        }
      });

      vehicleFormData.append(
        "images-INITIAL_FORMS",
        vehicleData.images["images-INITIAL_FORMS"]
      );
      vehicleFormData.append(
        "images-TOTAL_FORMS",
        String(vehicleImages.length)
      );
      vehicleFormData.append("images-MAX_NUM_FORMS", "20");
      vehicleFormData.append("images-MIN_NUM_FORMS", "0");
    }

    if (_vehicleState.contract_type == "RENTAL")
      vehicleFormData.append("rental_price", _vehicleState.rental_price);
    else if (_vehicleState.contract_type == "SALE")
      vehicleFormData.append("sale_price", _vehicleState.sale_price);
    else if (_vehicleState.contract_type == "RENTAL_SALE") {
      vehicleFormData.append("sale_price", _vehicleState.sale_price);
      vehicleFormData.append("rental_price", _vehicleState.rental_price);
    }

    if (_vehicleState.contact_days) {
      /*Object.values(_vehicleState.contact_days).forEach((day: any) => {
        vehicleFormData.append("contact_days[]", day);
      });*/
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
    let contactPhone = getVehicleNumberPhone("FIXED");
    let contactMobile = getVehicleNumberPhone("MOBILE");

    if (_vehicleState.contact_phone) {
      if (contactPhone) {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-number`,
          _vehicleState.contact_phone
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-id`,
          String(contactPhone.id)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-country_number`,
          String(contactPhone.country_number)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-DELETE`,
          "None"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-ptype`,
          String(contactPhone.ptype)
        );
        if (_vehicleState.contact_phone_ext) {
          vehicleFormData.append(
            `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-ext`,
            String(_vehicleState.contact_phone_ext)
          );
        } else {
          vehicleFormData.append(
            `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-ext`,
            String(_vehicleState.contact_phone_ext)
          );
        }
      } else {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-0-number`,
          _vehicleState.contact_phone
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-0-country_number`,
          "123"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-0-ptype`,
          "FIXED"
        );
        if (_vehicleState.contact_phone_ext)
          vehicleFormData.append(
            `${vehicleData.contact_phone_numbers.prefix}-0-ext`,
            String(_vehicleState.contact_phone_ext)
          );
      }
    } else {
      if (contactPhone) {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-number`,
          vehicleData.contact_phone_numbers[
            `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-number`
          ]
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-id`,
          String(contactPhone.id)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-country_number`,
          String(contactPhone.country_number)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-DELETE`,
          "True"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactPhone.index}-ptype`,
          String(contactPhone.ptype)
        );
      }
    }

    if (_vehicleState.contact_mobile) {
      if (contactMobile) {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-number`,
          _vehicleState.contact_phone
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-id`,
          String(contactMobile.id)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-country_number`,
          String(contactMobile.country_number)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-DELETE`,
          "None"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-ptype`,
          String(contactMobile.ptype)
        );
      } else {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${
            _vehicleState.contact_phone ? 1 : 0
          }-number`,
          _vehicleState.contact_mobile
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${
            _vehicleState.contact_phone ? 1 : 0
          }-country_number`,
          "123"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${
            _vehicleState.contact_phone ? 1 : 0
          }-ptype`,
          "MOBILE"
        );
      }
    } else {
      if (contactMobile) {
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-number`,
          vehicleData.contact_phone_numbers[
            `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-number`
          ]
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-id`,
          String(contactMobile.id)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-country_number`,
          String(contactMobile.country_number)
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-DELETE`,
          "True"
        );
        vehicleFormData.append(
          `${vehicleData.contact_phone_numbers.prefix}-${contactMobile.index}-ptype`,
          String(contactMobile.ptype)
        );
      }
    }

    let numberCount = 0;
    if (_vehicleState.contact_phone) numberCount++;
    if (_vehicleState.contact_mobile) numberCount++;

    vehicleFormData.append(
      `${vehicleData.contact_phone_numbers.prefix}-INITIAL_FORMS`,
      vehicleData.contact_phone_numbers[
        `${vehicleData.contact_phone_numbers.prefix}-INITIAL_FORMS`
      ]
    );
    vehicleFormData.append(
      `${vehicleData.contact_phone_numbers.prefix}-MAX_NUM_FORMS`,
      vehicleData.contact_phone_numbers[
        `${vehicleData.contact_phone_numbers.prefix}-MAX_NUM_FORMS`
      ]
    );
    vehicleFormData.append(
      `${vehicleData.contact_phone_numbers.prefix}-MIN_NUM_FORMS`,
      vehicleData.contact_phone_numbers[
        `${vehicleData.contact_phone_numbers.prefix}-MIN_NUM_FORMS`
      ]
    );
    vehicleFormData.append(
      `${vehicleData.contact_phone_numbers.prefix}-TOTAL_FORMS`,
      String(numberCount)
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
      String(_vehicleState.location_city.id)
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
    vehicleFormData.append("model", String(_vehicleState.model.id));
    vehicleFormData.append("brand", _vehicleState.model.brand.id);
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

    for (const value of vehicleFormData.entries()) {
      console.log(value);
    }

    await editVehicle(vehicleFormData, String(vehicleData.id));
  }

  function onChangeVideosQuantity(_quantity: Number) {
    setVehicleVideosQuantity(_quantity);
    let _vehicleVideos = Array(_quantity);
    _vehicleVideos.fill(1);
    setVehicleVideosList(_vehicleVideos);
  }

  function PhoneNumberSection() {
    if (phoneNumberState) {
      return (
        <FlexboxGrid>
          <PhoneInput
            label={"Phone"}
            style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
            className="phone-number-input"
            value={
              vehicleState.contact_phone ??
              getVehicleNumberPhone("FIXED")?.number
            }
            onChange={(_value: any) =>
              onChangeCreateVehicleRequest(_value, "contact_phone")
            }
          />
          <Input
            className="phone-text-input"
            value={
              vehicleState.contact_phone_ext ??
              getVehicleNumberPhone("FIXED")?.ext
            }
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
          value={
            vehicleState.contact_mobile ??
            getVehicleNumberPhone("MOBILE")?.number
          }
          onChange={(_value: any) => {
            onChangeCreateVehicleRequest(_value, "contact_mobile");
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
    console.log(vehicleData);
    console.log(user);

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

    if (vehicleData) {
      const contactPhone = getVehicleNumberPhone("FIXED");
      const contactMobile = getVehicleNumberPhone("MOBILE");

      setVehicleState((prevState: any) => ({
        ...prevState,
        year: vehicleData
          ? parseInt(dayjs(vehicleData.year).format("YYYY"))
          : "",
        contact_hour_from: vehicleData
          ? dayjs(`2022-01-01 ${vehicleData.contact_hour_from}`).format("hh")
          : "",
        contact_hour_from_system: vehicleData
          ? dayjs(`2022-01-01 ${vehicleData.contact_hour_from}`).format("a")
          : "",
        contact_hour_to: vehicleData
          ? dayjs(`2022-01-01 ${vehicleData.contact_hour_to}`).format("hh")
          : "",
        contact_hour_to_system: vehicleData
          ? dayjs(`2022-01-01 ${vehicleData.contact_hour_to}`).format("a")
          : "",
        contact_phone: contactPhone ? contactPhone.number : "",
        contact_phone_ext: contactPhone ? contactPhone.ext : "",
        contact_mobile: contactMobile ? contactMobile.number : "",
        currency: vehicleData.currency ? vehicleData.currency.id : null,
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

      setVehicleModelsState(() =>
        vehicleData.models
          ? vehicleData.models.map((model: any) => ({
              label: model.name,
              value: model.id,
            }))
          : []
      );

      if (vehicleData.images) {
        let _vehicleImages = {};
        let indexes = [
          0,
          1,
          2,
          3,
          4,
          5,
          ,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
        ];

        indexes.forEach((imageIndex) => {
          if (
            vehicleData.images[`images-${imageIndex}-id`] != undefined &&
            vehicleData.images[`images-${imageIndex}-id`] != null
          ) {
            const _imageName =
              vehicleData.images[`images-${imageIndex}-image`].split("/")[
                vehicleData.images[`images-${imageIndex}-image`].split("/")
                  .length - 1
              ];

            const currentImage = {
              id: vehicleData.images[`images-${imageIndex}-id`],
              url: `http://127.0.0.1:8000${
                vehicleData.images[`images-${imageIndex}-image`]
              }`,
              name: _imageName,
              fileKey: vehicleData.images[`images-${imageIndex}-id`],
              delete: vehicleData.images[`images-${imageIndex}-DELETE`],
            };
            _vehicleImages[imageIndex] = [];
            _vehicleImages[imageIndex].push(currentImage);
          }
        });

        setVehicleImagesState((prevState) => ({
          ...prevState,
          ..._vehicleImages,
        }));
      }
    }
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
  }

  async function onChangeBrand(_brandId: number) {
    const _vehicleState = vehicleState;
    _vehicleState.model.brand.id = _brandId;
    setVehicleState((prevState: any) => ({ ...prevState, ..._vehicleState }));
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
    _vehicleState.model.id = _modelId;
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

  function getVehicleNumberPhone(_type: string) {
    if (!_type) return null;

    let _number = {
      id: null,
      number: null,
      ext: null,
      DELETE: null,
      country_number: null,
      ptype: null,
    };

    let currentIndex = -1;

    for (let index = 0; index < 2; index++) {
      if (
        vehicleData.contact_phone_numbers[
          `${vehicleData.contact_phone_numbers.prefix}-${index}-id`
        ]
      ) {
        if (
          vehicleData.contact_phone_numbers[
            `${vehicleData.contact_phone_numbers.prefix}-${index}-ptype`
          ] === _type
        ) {
          _number.id =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-id`
            ];
          _number.number =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-number`
            ];
          _number.ext =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-ext`
            ];
          _number.DELETE =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-DELETE`
            ];
          _number.country_number =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-country_number`
            ];
          _number.ptype =
            vehicleData.contact_phone_numbers[
              `${vehicleData.contact_phone_numbers.prefix}-${index}-ptype`
            ];
          currentIndex = index;
          break;
        }
      }
    }

    return vehicleData.contact_phone_numbers[
      `${vehicleData.contact_phone_numbers.prefix}-${currentIndex}-id`
    ]
      ? { ..._number, index: currentIndex }
      : null;
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
          <Form onSubmit={onSubmitEditVehicle}>
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
                            vehicleState.location_continent ??
                            (vehicleState.location_city
                              ? vehicleState.location_city.state.country
                                  .continent
                              : vehicleState.location_continent)
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
                            vehicleState
                              ? vehicleState.location_city.state.country.id
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
                            vehicleState
                              ? vehicleState.location_city.state.id
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
                            vehicleState ? vehicleState.location_city.id : null
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
                          value={vehicleState ? vehicleState.location_zone : ""}
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
                        <RadioGroup
                          name="contract"
                          value={
                            vehicleState ? vehicleState.contract_type : null
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
                            vehicleState.model
                              ? vehicleState.model.brand
                                ? vehicleState.model.brand.id
                                : null
                              : null
                          }
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
                        <SelectPicker
                          name="model"
                          placeholder="Selecciona un modelo"
                          data={vehicleModelsState}
                          value={
                            vehicleState.model ? vehicleState.model.id : null
                          }
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
                        <SelectPicker
                          name="year"
                          placeholder="Selecciona un año"
                          data={yearsState}
                          value={vehicleState ? vehicleState.year : null}
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
                        <SelectPicker
                          name="status"
                          placeholder="Selecciona un status"
                          data={vehicleStatusState}
                          value={vehicleState ? vehicleState.status : null}
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
                        <SelectPicker
                          name="type"
                          placeholder="Selecciona un tipo"
                          data={vehicleTypesState}
                          value={
                            vehicleState ? vehicleState.type_vehicle : null
                          }
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
                  <div>
                    <p style={{ textAlign: "center", paddingTop: 32 }}>
                      Arrastre los videos que desea cargar en cada uno de los
                      recuadros
                    </p>
                    <Grid style={{ width: "100%" }}>
                      {vehicleVideosList.map((number, index) => (
                        <Col key={index} xs={6}>
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
                  <Input
                    name="moreDetails"
                    as="textarea"
                    value={vehicleState ? vehicleState.details : null}
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
                    value={vehicleState ? vehicleState.exact_location : null}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "exact_location")
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
                    value={vehicleState ? vehicleState.services : null}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "services")
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
                    value={vehicleState ? vehicleState.accessories : null}
                    onChange={(_value: any) =>
                      onChangeCreateVehicleRequest(_value, "accessories")
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
                        vehicleState
                          ? vehicleState.sale_price || vehicleState.rental_price
                          : null
                      }
                      onChange={(_value: any) => {
                        if (vehicleState.contract_type === "RENTAL_SALE") {
                          onChangeCreateVehicleRequest(_value, "rental_price");
                          onChangeCreateVehicleRequest(_value, "sale_price");
                        }
                        if (vehicleState.contract_type === "RENTAL") {
                          onChangeCreateVehicleRequest(_value, "rental_price");
                          onChangeCreateVehicleRequest(null, "sale_price");
                        }
                        if (vehicleState.contract_type === "SALE") {
                          onChangeCreateVehicleRequest(null, "rental_price");
                          onChangeCreateVehicleRequest(_value, "sale_price");
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
                      value={vehicleState.currency.id ?? vehicleState.currency}
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
                      name="contactName"
                      placeholder="Jesús Antonio"
                      value={
                        vehicleState ? vehicleState.contact_first_name : null
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
                        vehicleState ? vehicleState.contact_last_name : null
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
                      value={vehicleState ? vehicleState.contact_email : null}
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
                    <CheckboxGroup
                      value={vehicleState ? vehicleState.contact_days : []}
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
                            vehicleState ? vehicleState.contact_hour_from : null
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
                          vehicleState
                            ? vehicleState.contact_hour_from_system
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
                            vehicleState ? vehicleState.contact_hour_to : null
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
                          vehicleState
                            ? vehicleState.contact_hour_to_system
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
  // countries: [];
}

export const getServerSideProps = withAuth<EditVehiclePageProps>({
  async getServerSideProps({ params, djRequest, user }) {
    const response = await djRequest(`api/vehicle/${params.vehicleId}`, {
      method: "GET",
    });

    const data = await response.json();

    return {
      props: {
        vehicleData: data,
        user: user,
      },
    };
  },
});
