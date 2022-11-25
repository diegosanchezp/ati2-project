import React from "react";
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

  return (
    <Container>
      <p id="contact-type-title">Quiero que me llamen</p>

      <Form fluid>
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
                />
                <Form.Control name="movil" />
              </Form.Group>
              <p>Fijo</p>
              <Form.Group controlId="fijo" className="contact-number">
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 224 }}
                  searchable={false}
                  virtualized
                  label="Código"
                />
                <Form.Control name="fijo" />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Nombre</p>
            </td>
            <td>
              <Form.Group controlId="nombre">
                <Form.Control name="name" />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Apellido</p>
            </td>
            <td>
              <Form.Group controlId="lastname">
                <Form.Control name="lastname" />
              </Form.Group>
            </td>
          </tr>
          <tr>
            <td>
              <p className="contact-line-name">Dias de contacto</p>
            </td>
            <td>
              <Form.Group controlId="days">
                <CheckboxGroup inline name="checkboxList" id="days-contac-grid">
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
                />
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label="Hora"
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
                />
                <SelectPicker
                  data={dataCodeNumber}
                  style={{ width: 200 }}
                  searchable={false}
                  virtualized
                  label="Hora"
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
            <Button id="contact-send-button" appearance="primary">
              Contactar enuciante
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default CallMeForm;
