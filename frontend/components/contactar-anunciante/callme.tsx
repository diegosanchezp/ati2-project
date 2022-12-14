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
  CheckboxGroup,
  DatePicker,
} from "rsuite";
import { djRequest, getCSRF } from "../../utils/apirest";
import Metadata from "react-phone-number-input";
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function CallMeForm(props: any) {
  const codePhone = Object.keys(
    Metadata.defaultProps.metadata["country_calling_codes"]
  ).map((item) => ({
    label: item,
    value: item,
  }));
  const Tcontact = useTranslations();
  const Tform = useTranslations("form");
  const { setType, setText, setSendForm } = props.notification;
  const { vehicle } = props.vehicle;

  const { dispatch, session } = useSession();

  let userEmail = "";
  if (session.user) {
    userEmail = session.user.email;
  }
  const [timeFrom, setimeFrom] = useState("");
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
      contact_hour_from: `${initHourOne}:${initHourTwo}:00`,
      contact_hour_to: `${finHourOne}:${finHourTwo}:00`,
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
      const url = `contact/call-me/`;
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
      console.log("data response", data);
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
    console.log("body ", body);
  }
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
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=1200,height=900,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };
  const dataCodeNumber = ["10", "11"].map((item) => ({
    label: item,
    value: item,
  }));
  const dataHourList = [...Array(24).keys()].map((item) => {
    let value = `${item}`;
    if (item < 10) {
      value = `0${item}`;
    }
    return { label: value, value };
  });

  const dataMinuteList = [...Array(60).keys()].map((item) => {
    let value = `${item}`;
    if (item < 10) {
      value = `0${item}`;
    }
    return { label: value, value };
  });

  return (
    <Container>
      <p id="contact-type-title">{Tcontact("options.call-me")}</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
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
              <p className="contact-line-name">{Tform("days.label")}</p>
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
                  <Checkbox value="LUNES">
                    {Tform("days.daysValues.monday")}
                  </Checkbox>
                  <Checkbox value="MARTES">
                    {Tform("days.daysValues.tuesday")}
                  </Checkbox>
                  <Checkbox value="MIERCOLES">
                    {Tform("days.daysValues.wednesday")}
                  </Checkbox>
                  <Checkbox value="JUEVES">
                    {Tform("days.daysValues.thursday")}
                  </Checkbox>
                  <Checkbox value="VIERNES">
                    {Tform("days.daysValues.friday")}
                  </Checkbox>
                  <Checkbox value="SABADO">
                    {Tform("days.daysValues.saturday")}
                  </Checkbox>
                  <Checkbox value="DOMINGO">
                    {Tform("days.daysValues.sunday")}
                  </Checkbox>
                </CheckboxGroup>
              </Form.Group>
            </td>
          </tr>

          <tr>
            <td>
              <p className="contact-line-name">{Tform("hours.label")}</p>
            </td>
            <td>
              <p>{Tform("hours.from")}</p>
              <Form.Group controlId="movil" className="contact-hour">
                <SelectPicker
                  data={dataHourList}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label={Tform("hours.hour")}
                  value={initHourOne}
                  onChange={setInitHourOne}
                />
                <SelectPicker
                  data={dataMinuteList}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label={Tform("hours.minute")}
                  value={initHourTwo}
                  onChange={setInitHourTwo}
                />
              </Form.Group>
              <p>{Tform("hours.to")}</p>
              <Form.Group controlId="fijo" className="contact-hour">
                <SelectPicker
                  data={dataHourList}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label={Tform("hours.hour")}
                  value={finHourOne}
                  onChange={setFinHourOne}
                />
                <SelectPicker
                  data={dataMinuteList}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label={Tform("hours.minute")}
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

export default CallMeForm;
