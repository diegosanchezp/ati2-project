import { useSession } from "auth";
import React, { useState } from "react";
import * as dayjs from "dayjs";
import {
  Container,
  Button,
  Form,
  ButtonToolbar,
  Input,
  SelectPicker,
  Stack,
  DatePicker,
  Radio,
  RadioGroup,
  Checkbox,
} from "rsuite";
import { useTranslations } from "next-intl";
import Metadata from "react-phone-number-input";
import { djRequest, getCSRF } from "../../utils/apirest";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
function ScheduleVisitForm(props: any) {
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
  const [date, setDate] = useState();
  //number phone (fix)
  const [fixCode, setFixCode] = useState([]);
  const [fixNumber, setFixNumber] = useState("");
  const [fixExt, setFixExt] = useState("");
  //number phone (Mov)
  const [movCode, setMovCode] = useState([]);
  const [movNumber, setMovNumber] = useState("");
  const [selectFix, setSelectFix] = useState(false);

  //hours
  const [initHourOne, setInitHourOne] = useState("");
  const [initHourTwo, setInitHourTwo] = useState("");
  const [finHourOne, setFinHourOne] = useState("");
  const [finHourTwo, setFinHourTwo] = useState("");
  const [typeTime, setTypeTime] = useState("");
  const [selectMobile, setSelectMobile] = useState(false);
  const { setType, setText, setSendForm } = props.notification;
  function handleSubmit() {
    let dateMonth = "00";
    let dateDay = "00";
    let dateYear = "00";
    if (date) {
      dateYear = dayjs(date).get("year");

      dateMonth =
        dayjs(date).get("month") + 1 < 10
          ? `0${dayjs(date).get("month") + 1}`
          : `${dayjs(date).get("month") + 1}`;

      dateDay =
        dayjs(date).get("date") < 10
          ? `0${dayjs(date).get("date")}`
          : `${dayjs(date).get("date")}`;
    }

    const body = {
      userId: vehicle.owner.id,
      name: firstName,
      lastname: lastName,
      typeVisit: typeTime,
      date: `${dateYear}-${dateMonth}-${dateDay}`, //"2022-02-27",
      message,
    };
    if (typeTime === "TIME") {
      body["contact_hour_from"] = `${initHourOne}:${initHourTwo}`;
      body["contact_hour_to"] = `${finHourOne}:${finHourTwo}`;
    }
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
    console.log("body ", body);
    const fetchData = async () => {
      const url = `contact/visit/`;
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
  const dataCodeNumber = ["54", "53"].map((item) => ({
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
      <p id="contact-type-title">{Tcontact("options.visit")}</p>

      <Form fluid onSubmit={handleSubmit}>
        <table id="contact-table">
          <tr>
            <td>
              <p className="contact-line-name">{Tform("date")}</p>
            </td>
            <td>
              <Form.Group controlId="date">
                <Stack direction="column" alignItems="flex-start" spacing={6}>
                  <DatePicker
                    placeholder={Tform("date")}
                    style={{ width: 380 }}
                    ranges={[{}]}
                    value={date}
                    onChange={setDate}
                  />
                </Stack>
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
              <p className="contact-line-name">{Tform("schedule.label")}</p>
            </td>
            <td>
              <RadioGroup name="radioList">
                <Radio
                  value="TIME"
                  checked={typeTime === "TIME"}
                  onChange={setTypeTime}
                >
                  {Tform("schedule.specific")}
                </Radio>
                <p>{Tform("hours.from")}</p>
                <Form.Group controlId="deste-hora" className="contact-hour">
                  <SelectPicker
                    data={dataHourList}
                    style={{ width: 150 }}
                    searchable={false}
                    virtualized
                    label={Tform("hours.hour")}
                    value={initHourOne}
                    onChange={setInitHourOne}
                    disabled={typeTime === "PERSONALIZED"}
                  />
                  <SelectPicker
                    data={dataMinuteList}
                    style={{ width: 200 }}
                    searchable={false}
                    virtualized
                    label={Tform("hours.minute")}
                    value={initHourTwo}
                    onChange={setInitHourTwo}
                    disabled={typeTime === "PERSONALIZED"}
                  />
                </Form.Group>
                <p>{Tform("hours.to")}</p>
                <Form.Group controlId="hasta-hora" className="contact-hour">
                  <SelectPicker
                    data={dataHourList}
                    style={{ width: 150 }}
                    searchable={false}
                    virtualized
                    label={Tform("hours.hour")}
                    value={finHourOne}
                    onChange={setFinHourOne}
                    disabled={typeTime === "PERSONALIZED"}
                  />
                  <SelectPicker
                    data={dataMinuteList}
                    style={{ width: 200 }}
                    searchable={false}
                    virtualized
                    label={Tform("hours.minute")}
                    value={finHourTwo}
                    onChange={setFinHourTwo}
                    disabled={typeTime === "PERSONALIZED"}
                  />
                </Form.Group>
                <Radio
                  value="PERSONALIZED"
                  checked={typeTime === "PERSONALIZED"}
                  onChange={setTypeTime}
                >
                  {Tform("schedule.to-agree")}
                </Radio>
              </RadioGroup>
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
              <p className="contact-line-name">{Tform("details")}</p>
            </td>
            <td>
              <Form.Group controlId="textarea">
                <Form.Control
                  rows={3}
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

export default ScheduleVisitForm;
