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
  Radio,
  Checkbox,
} from "rsuite";
import Metadata from "react-phone-number-input";
import { djRequest, getCSRF } from "../../utils/apirest";
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function SendConsultaForm(props: any) {
  const codePhone = Object.keys(
    Metadata.defaultProps.metadata["country_calling_codes"]
  ).map((item) => ({
    label: item,
    value: item,
  }));

  const Tcontact = useTranslations();
  const Tform = useTranslations("form");

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
  const [days, setDays] = useState([]);
  //number phone (fix)
  const [fixCode, setFixCode] = useState([]);
  const [fixNumber, setFixNumber] = useState("");
  const [fixExt, setFixExt] = useState("");
  const [selectFix, setSelectFix] = useState(false);
  //number phone (Mov)
  const [movCode, setMovCode] = useState([]);
  const [movNumber, setMovNumber] = useState("");
  const [selectMobile, setSelectMobile] = useState(false);
  const { setType, setText, setSendForm } = props.notification;
  function handleSubmit() {
    const body = {
      userId: vehicle.owner.id,
      toEmail: email,
      name: firstName,
      lastname: lastName,
      message,
    };
    if (fixCode.length > 0 && fixNumber.length > 0 && selectFix) {
      body["fixedPhone"] = {
        number: fixNumber,
        country_number: parseInt(fixCode),
        ext: fixExt,
        ptype: "FIXED",
      };
    }
    if (movCode.length > 0 && movNumber.length > 0 && selectMobile) {
      body["mobilePhone"] = {
        number: movNumber,
        country_number: parseInt(movCode),
        ptype: "MOBILE",
      };
    }
    const fetchData = async () => {
      const url = `contact/send-consult/`;
      const { csrfToken, csrfRes } = await getCSRF();
      console.log("url details ", url);
      const response = await djRequest(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken as string,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setType("success");
        setText(Tcontact("send"));
        setSendForm(true);
        return data;
      } else {
        setType("error");
        setText("Error");
        setSendForm(true);
      }
    };

    fetchData();
    //console.log("body ", body);
  }
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=1200,height=900,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };
  const dataCodeNumber = ["+54", "+53"].map((item) => ({
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
      <p id="contact-type-title">{Tcontact("options.send-consult")}</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
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
                  data={codePhone}
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
                  data={codePhone}
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

export default SendConsultaForm;
