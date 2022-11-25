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
  return (
    <Container>
      <p id="contact-type-title">Llamar por teléfono</p>
      <table id="contact-table">
        <tr>
          <td>
            <p className="contact-line-name">Telefono</p>
          </td>
          <td>
            <p>0414-2051058</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">Nombre y apellido</p>
          </td>
          <td>
            <p>Nombre aaaaaa</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">Pais</p>
          </td>
          <td>
            <p>Venezuela</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">Días de contacto</p>
          </td>
          <td>
            <p>Lunes a viernes</p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="contact-line-name">Horas de contacto</p>
          </td>
          <td>
            <p>7:00-4:00</p>
          </td>
        </tr>
      </table>
    </Container>
  );
}

export default CallContact;
