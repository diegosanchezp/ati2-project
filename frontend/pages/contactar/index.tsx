import {
  Popover,
  Whisper,
  Button,
  Toggle,
  Container,
  RadioGroup,
  Radio,
  Form,
  ButtonToolbar,
  Input,
} from "rsuite";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FormContactar from "components/contactar-anunciante/contactar-form";
import { useSession } from "auth";
import { djRequest } from "utils/apirest";

function ContactarAnunciante(props: any) {
  const router = useRouter();
  const vehicleId = router.query.id;

  const [vehicle, setVehicle] = useState();

  //session data variables
  let isLogin = false;
  let isOwner = false;
  let sessionUserId = -1;
  setSessionData();
  function setSessionData() {
    const { dispatch, session } = useSession();
    console.log("session user test ", session);
    console.log("login  ", isLogin);
    if (session.user) {
      isLogin = true;
      sessionUserId = session.user.id || -1;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = `vehicle/${vehicleId}/`;
      console.log("url details ", url);
      const response = await djRequest(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("vehicle ", data);
        setVehicle(data);
        isOwner = sessionUserId === data.owner.id;

        return data;
      }
    };

    fetchData();
  }, [vehicleId]);

  function close() {
    window.open("", "_parent", "");
    window.close();
  }
  const openInNewTab = (url: string) => {
    window.open(
      url,
      "name",
      "width=600,height=800,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=100, top=20"
    );
  };

  const [option, setOption] = useState(0); //opcion seleccionada
  const [optionsForm, setOptionForm] = useState([
    false,
    false,
    false,
    false,
    false,
  ]); //control check radio?
  const selectType = (e: any) => {
    const value = e;
    console.log("click ", value);
    setOption(parseInt(value));

    console.log("-------------------------------------------------------");
  };

  return (
    <Container>
      {vehicle ? (
        <Container id="contactar-anunciante-container">
          <Container id="contactar-anunciante-type-container">
            <p id="contactar-anunciante-type">
              Selecciona la opción de tu preferencia
            </p>
            <Container>
              <RadioGroup name="radioList">
                <Radio value="1" checked={optionsForm[0]} onChange={selectType}>
                  Enviar correo electrónico
                </Radio>
                <Radio value="2" checked={optionsForm[1]} onChange={selectType}>
                  Llamar por teléfono
                </Radio>
                <Radio value="3" checked={optionsForm[2]} onChange={selectType}>
                  Quiero que me llamen
                </Radio>
                <Radio value="4" checked={optionsForm[3]} onChange={selectType}>
                  Enviar consulta
                </Radio>
                <Radio value="5" checked={optionsForm[4]} onChange={selectType}>
                  Agendar visita
                </Radio>
              </RadioGroup>
            </Container>
            <Button color="orange" appearance="primary" onClick={close}>
              Cerrar
            </Button>
          </Container>
          <Container>
            {option ? (
              <FormContactar option={option} vehicle={vehicle} />
            ) : (
              <Container></Container>
            )}
          </Container>
        </Container>
      ) : (
        <Container></Container>
      )}
    </Container>
  );
}

export default ContactarAnunciante;
