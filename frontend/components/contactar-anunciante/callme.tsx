import { useSession } from "auth";
import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  ButtonToolbar,
  Input,
  SelectPicker,
  Checkbox,
  CheckboxGroup,
} from "rsuite";
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function CallMeForm(props: any) {
  const { vehicle } = props;

  const { dispatch, session } = useSession();

  let userEmail = "";
  if (session.user) {
    userEmail = session.user.email;
  }
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userEmail);
  const [message, setMessage] = useState("");
  const [days, setDays] = useState([]);
  //number phone (fix)
  const [fixCode, setFixCode] = useState([]);
  const [fixNumber, setFixNumber] = useState("");
  const [fixExt, setFixExt] = useState("");
  //number phone (Mov)
  const [movCode, setMovCode] = useState([]);
  const [movNumber, setMovNumber] = useState("");
  const [movExt, setMovExt] = useState("");
  //hours
  const [initHourOne, setInitHourOne] = useState("");
  const [initHourTwo, setInitHourTwo] = useState("");
  const [finHourOne, setFinHourOne] = useState("");
  const [finHourTwo, setFinHourTwo] = useState("");

  function handleSubmit() {
    const body = {
      userId: vehicle.owner.id,
      name: firstName,
      lastname: lastName,
      contact_days: days,
      contact_hour_from: `${initHourOne}:${initHourTwo}`,
      contact_hour_to: `${finHourOne}:${finHourTwo}`,
    };
    if (fixCode.length > 0 && fixNumber.length > 0) {
      body["fixedPhone"] = {
        number: fixNumber,
        country_number: parseInt(fixCode),
        ext: fixExt,
        ptype: "FIXED",
      };
    }
    if (fixCode.length > 0 && fixNumber.length > 0) {
      body["mobilePhone"] = {
        number: movNumber,
        country_number: parseInt(movCode),
        ptype: "MOBILE",
      };
    }
    console.log("body ", body);
  }
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=1200,height=900,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };
  const dataCodeNumber = ["54", "53"].map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <Container>
      <p id="contact-type-title">Quiero que me llamen</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
          <tr>
            <td>
              <p className="contact-line-name">Teléfono</p>
            </td>
            <td>
              <p>Movil</p>
              <Form.Group controlId="movil" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 224 }}
                  searchable={false}
                  virtualized
                  label="Código"
                  value={movCode}
                  onChange={setMovCode}
                />
                <Form.Control
                  name="movil"
                  value={movNumber}
                  onChange={setMovNumber}
                  placeholder="numero"
                />
              </Form.Group>
              <p>Fijo</p>
              <Form.Group controlId="fijo" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 224 }}
                  searchable={false}
                  virtualized
                  label="Código"
                  value={fixCode}
                  onChange={setFixCode}
                />
                <Form.Control
                  name="fijo"
                  placeholder="numero"
                  value={fixNumber}
                  onChange={setFixNumber}
                />
                <Form.Control
                  name="fijo-ext"
                  placeholder="extension"
                  placeholder="extension"
                  value={fixExt}
                  onChange={setFixExt}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Nombre</p>
            </td>
            <td>
              <Form.Group controlId="nombre">
                <Form.Control
                  name="name"
                  value={firstName}
                  onChange={setFirstName}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Apellido</p>
            </td>
            <td>
              <Form.Group controlId="lastname">
                <Form.Control
                  name="lastname"
                  value={lastName}
                  onChange={setLastName}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Dias de contacto</p>
            </td>
            <td>
              <Form.Group controlId="days">
                <CheckboxGroup
                  inline
                  name="checkboxList"
                  id="days-contac-grid"
                  value={days}
                  onChange={setDays}
                >
                  <Checkbox value="LUNES">Lunes</Checkbox>
                  <Checkbox value="MARTES">Martes</Checkbox>
                  <Checkbox value="MIERCOLES">Miercoles</Checkbox>
                  <Checkbox value="JUEVES">Jueves</Checkbox>
                  <Checkbox value="VIERNES">Viernes</Checkbox>
                  <Checkbox value="SABADO">Sabado</Checkbox>
                  <Checkbox value="DOMINGO">Domingo</Checkbox>
                </CheckboxGroup>
              </Form.Group>
            </td>
          </tr>

          <tr>
            <td>
              <p className="contact-line-name">Horas de contacto</p>
            </td>
            <td>
              <p>Desde</p>
              <Form.Group controlId="movil" className="contact-hour">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 150 }}
                  searchable={false}
                  virtualized
                  label="Tipo"
                  value={initHourOne}
                  onChange={setInitHourOne}
                />
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label="Hora"
                  value={initHourTwo}
                  onChange={setInitHourTwo}
                />
              </Form.Group>
              <p>Hasta</p>
              <Form.Group controlId="fijo" className="contact-hour">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 150 }}
                  searchable={false}
                  virtualized
                  label="Tipo"
                  value={finHourOne}
                  onChange={setFinHourOne}
                />
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label="Hora"
                  value={finHourTwo}
                  onChange={setFinHourTwo}
                />
              </Form.Group>
            </td>
          </tr>
        </table>
        <p>
          <span style={{ color: "#eb3626" }}>* </span>
          <span style={{ color: "#2589f5" }}>
            Por favor verifique que sus datos sean los correctos, ya que serán
            utilizados por el anunciante para contactarlo
          </span>
        </p>

        <Form.Group>
          <ButtonToolbar>
            <Button id="contact-send-button" appearance="primary" type="submit">
              Contactar enuciante
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default CallMeForm;
