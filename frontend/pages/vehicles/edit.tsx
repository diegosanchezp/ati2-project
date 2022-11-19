import "@/styles/custom/index.less";
import React from "react";
import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import {
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

type EditVehiclePageProps = {};

const VehicleEditPage: PageWithSession<EditVehiclePageProps> = (props) => {
  const toaster = useToaster();

  const [mobileNumberState, setMobileNumberState] = React.useState(false);
  const [phoneNumberState, setPhoneNumberState] = React.useState(false);
  const [vehicleImagesState, setVehicleImagesState] = React.useState({});
  const [vehicleVideosState, setVehicleVideosState] = React.useState({});
  const [showVideosState, setShowVideosState] = React.useState(false);

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

  function onChangeMobile(_: any, checked: Boolean) {
    setMobileNumberState(checked);
  }

  function onChangePhone(_: any, checked: Boolean) {
    setPhoneNumberState(checked);
  }

  function onUploadVehicleImages(_list: any) {
    setVehicleImagesState(_list);
  }

  function onUploadVehicleVideos(_list: any) {
    setVehicleVideosState(_list);
  }

  function onSubmitEditVehicle(checkStatus: boolean, _form: React.FormEvent<HTMLFormElement>){
    let _reader = new FileReader()
    _reader.readAsDataURL(vehicleImagesState["0"].blobFile)
    _reader.onloadend = async () => {
      console.log(_reader.result)
    }
  }

  function onChangeVideosQuantity(_quantity: Number) {
    setVehicleVideosQuantity(_quantity)
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
          />
          <Input className="phone-text-input" />
        </FlexboxGrid>
      );
    }
    return null;
  }

  function MobileNumberSection() {
    if (mobileNumberState) {
      return (
        <PhoneInput specialLabel={"Mobile"} inputClass="phone-number-input" />
      );
    }
    return null;
  }

  const toastOptions = {
    placement: "bottomCenter",
  };
  return (
    <FlexboxGrid
      justify="center"
      style={{ marginTop: 40, paddingRight: 20, paddingLeft: 20 }}
    >
      <FlexboxGrid.Item colspan={12} style={{ width: "100%" }}>
        <Panel header={<h3>Modificar publicación</h3>} bordered>
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
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                        <SelectPicker
                          name="Zone"
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                        <RadioGroup name="contract">
                          <Radio value={0}>Alquiler</Radio>
                          <Radio value={1}>Venta</Radio>
                          <Radio value={2}>Alquiler y venta</Radio>
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
                          name="currency"
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          name="currency"
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          name="currency"
                          placeholder="Selecciona una moneda"
                          data={[]}
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
                          className={{
                            "remove-file-input-uploader":
                              vehicleImagesState[index] != undefined &&
                              vehicleImagesState[index] != {} &&
                              vehicleImagesState[index] != null,
                          }}
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
                      <p style={{ textAlign: 'center', paddingTop: 32 }}>
                        Arrastre los videos que desea cargar en cada uno de los
                        recuadros
                      </p>
                    ) : null}
                    {showVideosState
                      ? vehicleVideosList.map((number, index) => (
                          <Col key={index} xs={24/vehicleVideosQuantity}>
                            <Uploader
                              name="vehicleImages"
                              multiple
                              action=""
                              listType="picture"
                              accept=".mp4"
                              className={{
                                "remove-file-input-uploader":
                                  vehicleVideosState[index] != undefined &&
                                  vehicleVideosState[index] != {} &&
                                  vehicleVideosState[index] != null,
                              }}
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
                    rows={10}
                    style={{ resize: "none" }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 32 }}>
                <Col xs={10} xsPush={1}>
                  <Form.Group>
                    <Form.ControlLabel>Precio</Form.ControlLabel>
                    <Form.Control name="price" type="number" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.ControlLabel>Moneda</Form.ControlLabel>
                    <SelectPicker
                      name="currency"
                      placeholder="Selecciona una moneda"
                      data={[]}
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
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Apellido</Form.ControlLabel>
                    <Form.Control
                      name="contactLastName"
                      placeholder="Perez Castillo"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Correo electrócnico</Form.ControlLabel>
                    <Form.Control
                      name="contactEmail"
                      placeholder="jesusp@test.com"
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
                    <Grid style={{ width: "auto" }}>
                      <Col xs={6}>
                        <Checkbox>Lunes</Checkbox>
                        <Checkbox>Viernes</Checkbox>
                      </Col>
                      <Col xs={6}>
                        <Checkbox>Martes</Checkbox>
                        <Checkbox>Sábado</Checkbox>
                      </Col>
                      <Col xs={6}>
                        <Checkbox>Miércoles</Checkbox>
                        <Checkbox>Domingo</Checkbox>
                      </Col>
                      <Col xs={6}>
                        <Checkbox>Jueves</Checkbox>
                      </Col>
                    </Grid>
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
                    <FlexboxGrid align="middle">
                      <Form.Group>
                        <Form.ControlLabel>Desde</Form.ControlLabel>
                        <SelectPicker
                          name="startContactTime"
                          placeholder="Selecciona una hora"
                          data={[]}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="startTimeSystem"
                        placeholder="am"
                        data={[]}
                        style={{ marginLeft: 8, width: 100 }}
                      />
                    </FlexboxGrid>
                    <FlexboxGrid align="middle">
                      <Form.Group>
                        <Form.ControlLabel>Hasta</Form.ControlLabel>
                        <SelectPicker
                          name="endContactTime"
                          placeholder="Selecciona una hora"
                          data={[]}
                        />
                      </Form.Group>
                      <SelectPicker
                        name="endTimeSystem"
                        placeholder="am"
                        data={[]}
                        style={{ marginLeft: 8, width: 100 }}
                      />
                    </FlexboxGrid>
                  </FlexboxGrid>
                </Col>
              </Row>
              <Row>
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

export const getServerSideProps = withAuth<VehiclesPageProps>({

	async getServerSideProps({user}){
    return {
      props: {
        a: "a",
      },
    }
  }
})
