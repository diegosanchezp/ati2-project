import { useSession } from "auth";
import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  ButtonToolbar,
  Input,
  SelectPicker,
} from "rsuite";
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function SendEmailForm(props: any) {
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
  //number phone (fix)
  const [fixCode, setFixCode] = useState([]);
  const [fixNumber, setFixNumber] = useState("");
  const [fixExt, setFixExt] = useState("");
  //number phone (Mov)
  const [movCode, setMovCode] = useState([]);
  const [movNumber, setMovNumber] = useState("");
  const [movExt, setMovExt] = useState("");

  function handleSubmit() {
    const body = {
      userId: vehicle.owner.id,
      toEmail: vehicle.contact_email,
      name: firstName,
      lastname: lastName,
      fromEmail: email,
      message,
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
      <p id="contact-type-title"> Enviar correo electrónico</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
          <tr>
            <td>
              <p className="contact-line-name">Para</p>
            </td>
            <td>
              <Form.Group controlId="to">
                <Form.Control
                  name="to"
                  value={vehicle.contact_email}
                  readOnly
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
              <p className="contact-line-name">Email</p>
            </td>
            <td>
              <Form.Group controlId="email">
                <Form.Control
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Teléfono</p>
            </td>
            <td>
              <p>Movil</p>
              <Form.Group controlId="movil" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 150 }}
                  searchable={false}
                  virtualized
                  label="Código"
                  value={movCode}
                  onChange={setMovCode}
                />
                <Form.Control
                  name="movil"
                  placeholder="numero"
                  value={movNumber}
                  onChange={setMovNumber}
                />
              </Form.Group>
              <p>Fijo</p>
              <Form.Group controlId="fijo" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 150 }}
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
                  name="ext"
                  placeholder="extension"
                  value={fixExt}
                  onChange={setFixExt}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Mensaje</p>
            </td>
            <td>
              <Form.Group controlId="textarea">
                <Form.Control
                  rows={5}
                  name="mensaje"
                  accepter={Textarea}
                  value={message}
                  onChange={setMessage}
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

export default SendEmailForm;
