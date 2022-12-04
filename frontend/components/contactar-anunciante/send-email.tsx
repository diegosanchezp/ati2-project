import { useSession } from "auth";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  ButtonToolbar,
  Input,
  SelectPicker,
  Checkbox,
} from "rsuite";
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function SendEmailForm(props: any) {
  const Tcontact = useTranslations();
  const Tform = useTranslations("form");

  const { setType, setText, setSendForm } = props.notification;
  const { vehicle } = props.vehicle;

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
  const [selectFix, setSelectFix] = useState(false);
  //number phone (Mov)
  const [movCode, setMovCode] = useState([]);
  const [movNumber, setMovNumber] = useState("");
  const [selectMobile, setSelectMobile] = useState(false);

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
    //fetch
    const ok = false;
    if (ok) {
      setType("success");
      setText("Solicitud enviada");
      setSendForm(true);
    } else {
      setType("error");
      setText("Error :/");
      setSendForm(true);
    }
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
  function handleSelectMobile() {
    setSelectMobile(!selectMobile);
    if (selectMobile) {
      setMovCode([]);
      setMovNumber("");
    }
  }
  function handleSelectFix() {
    setSelectFix(!selectFix);
    if (selectFix) {
      setFixCode([]);
      setFixNumber("");
      setFixExt("");
    }
  }
  return (
    <Container>
      <p id="contact-type-title">{Tcontact("options.send-email")}</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
          <tr>
            <td>
              <p className="contact-line-name">{Tform("to")}</p>
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
              <p className="contact-line-name">{Tform("name")}</p>
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
              <p className="contact-line-name">{Tform("lastname")}</p>
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
              <p className="contact-line-name">{Tform("email")}</p>
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
              <p className="contact-line-name">{Tform("phone.label")}</p>
            </td>
            <td>
              <Checkbox
                value="mobile"
                checked={selectMobile}
                onChange={handleSelectMobile}
              >
                {Tform("phone.mobile")}
              </Checkbox>
              <Form.Group controlId="movil" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 224 }}
                  searchable={false}
                  virtualized
                  label={Tform("phone.code")}
                  value={movCode}
                  onChange={setMovCode}
                  disabled={!selectMobile}
                />
                <Form.Control
                  name="movil"
                  value={movNumber}
                  onChange={setMovNumber}
                  placeholder={Tform("phone.number")}
                  disabled={!selectMobile}
                />
              </Form.Group>
              <Checkbox
                value="fix"
                checked={selectFix}
                onChange={handleSelectFix}
              >
                {Tform("phone.fix")}
              </Checkbox>
              <Form.Group controlId="fijo" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 224 }}
                  searchable={false}
                  virtualized
                  label={Tform("phone.code")}
                  value={fixCode}
                  onChange={setFixCode}
                  disabled={!selectFix}
                />
                <Form.Control
                  name="fijo"
                  placeholder={Tform("phone.number")}
                  value={fixNumber}
                  onChange={setFixNumber}
                  disabled={!selectFix}
                />
                <Form.Control
                  name="fijo-ext"
                  placeholder={Tform("phone.ext")}
                  value={fixExt}
                  onChange={setFixExt}
                  disabled={!selectFix}
                />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">{Tform("message")}</p>
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
            {Tcontact("message-general")}
          </span>
        </p>

        <Form.Group>
          <ButtonToolbar>
            <Button id="contact-send-button" appearance="primary" type="submit">
              {Tcontact("send-button")}
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default SendEmailForm;
