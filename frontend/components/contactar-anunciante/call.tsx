import { Phone } from "@rsuite/icons";
import { PhoneNumber } from "libphonenumber-js/types";
import { useTranslations } from "next-intl";
import React from "react";
import {
  Container,
  Button,
  Form,
  ButtonToolbar,
  Input,
  SelectPicker,
} from "rsuite";

function CallContact(props: any) {
  const Tcontact = useTranslations();
  const Tform = useTranslations("form");

  let { vehicle } = props;

  const contact_numbers = vehicle["contact_phone_numbers"];
  vehicle = vehicle.vehicle;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  //console.log("contact number data", contact_numbers);
  const contactDay = vehicle.contact_days;
  let fixNumber;
  let mobileNumber;
  for (const numberPhone of contact_numbers) {
    if (numberPhone.ptype === "MOBILE") {
      mobileNumber = `+${numberPhone["country_number"]} ${numberPhone.number}`;
    } else {
      const extension = numberPhone.ext ? ` ${numberPhone.ext}` : "";
      fixNumber = `+${numberPhone["country_number"]} ${numberPhone.number}${extension}`;
    }
  }

  const listDaysTranslate = Tform("days.daysValues");
  const daysToFront = contactDay.map((day) => Tform(`days.daysValues.${day}`));

  return (
    <Container>
      <p id="contact-type-title">{Tcontact("options.call")}</p>
      <table id="contact-table">
        <tr>
          <td>
            <p className="contact-line-name">{Tform("phone.label")}</p>
          </td>
          <td>
            {contact_numbers ? (
              <Container>
                <p>{mobileNumber ? mobileNumber : <Container></Container>}</p>
                <p>{fixNumber ? fixNumber : <Container></Container>}</p>
              </Container>
            ) : (
              <p>-</p>
            )}
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">{Tform("fullname")}</p>
          </td>
          <td>
            <p>
              {vehicle.contact_first_name} {vehicle.contact_last_name}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">{Tform("country")}</p>
          </td>
          <td>
            <p>{vehicle.location_city.location.split(">")[0]}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">{Tform("days.label")}</p>
          </td>
          <td>
            <p>{daysToFront.join().replace(",", ", ")}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">{Tform("hours.label")}</p>
          </td>
          <td>
            <p>
              {vehicle.contact_hour_from.slice(0, 5)} -
              {vehicle.contact_hour_to.slice(0, 5)}
            </p>
          </td>
        </tr>
      </table>
    </Container>
  );
}

export default CallContact;
