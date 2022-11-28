import { Button, Container } from "rsuite";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { djRequest, getCSRF } from "utils/apirest";

function PublicationsDetails(props: any) {
  const router = useRouter();
  console.log("query id ", router.query.id);
  const vehicleId = router.query.id;
  const [vehicle, setVehicle] = useState();
  const [accesorieList, setAccesorieList] = useState([]);
  const [detailsList, setDetailsList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  //console.log(router);

  useEffect(() => {
    const fetchData = async () => {
      const { csrfToken, csrfRes } = await getCSRF();

      const url = `vehicle/${vehicleId}/`;
      console.log("url details ", url);
      const response = await djRequest(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //"X-CSRFToken": csrfToken as string,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("vehicle ", data);
        setVehicle(data);

        setAccesorieList(data.accessories ? data.accessories.split(",") : []);
        setDetailsList(data.details ? data.details.split(",") : []);
        setServiceList(data.services ? data.services.split(",") : []);
        console.log("accesorieList ", accesorieList);
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

  return (
    <Container id="publications-windows-details">
      {vehicle ? (
        <Container>
          <Container className="publications-windows-details-section">
            <p className="publications-windows--details-subtitle">
              <b>Detalles del vehículo</b>
            </p>

            <Container>
              <ul className="publications-windows-details-section-list-none">
                <li>
                  {detailsList.map((accesorie) => (
                    <p>{accesorie}</p>
                  ))}
                </li>
              </ul>
            </Container>
          </Container>
          <Container className="publications-windows-details-section">
            <p className="publications-windows--details-subtitle">
              <b>Accesorios y comodidades</b>
            </p>
            <Container className="publications-windows-details-section-box">
              <ul className="publications-windows-details-section-list">
                <li>
                  {accesorieList.map((accesorie) => (
                    <p>{accesorie}</p>
                  ))}
                </li>
              </ul>
            </Container>
          </Container>
          <Container
            id="publications-windows-details-subtitle-rows"
            className="publications-windows-details-section"
          >
            <Container>
              <p className="publications-windows--details-subtitle">
                <b>Fotos</b>
              </p>
              <Container className="publications-windows-details-section-box">
                <a
                  //href="https://google.com"
                  style={{ color: "#eb3626" }}
                  href="fotos"
                  target="popup"
                  onClick={() => openInNewTab(`fotos?id=${vehicle.id}`)}
                >
                  Haz click aqui
                </a>
              </Container>
            </Container>
            <Container>
              <p className="publications-windows--details-subtitle">
                <b>Videos</b>
              </p>
              <Container className="publications-windows-details-section-box">
                <a
                  //href="https://google.com"
                  style={{ color: "#eb3626" }}
                  href="videos"
                  target="popup"
                  onClick={() => openInNewTab(`videos?id=${vehicle.id}`)}
                >
                  Haz click aqui
                </a>
              </Container>
            </Container>
          </Container>
          <Container className="publications-windows-details-section">
            <p className="publications-windows--details-subtitle">
              <b>Servicios al día</b>
            </p>
            <ul className="publications-windows-details-section-list-none">
              <li>
                {serviceList.map((accesorie) => (
                  <p>{accesorie}</p>
                ))}
              </li>
            </ul>
          </Container>
          <Container className="publications-windows-details-section">
            <p className="publications-windows--details-subtitle">
              <b>Ubicación exacta</b>
            </p>
            <Container className="publications-windows-details-section-box">
              <p>{vehicle.exact_location}</p>
            </Container>
          </Container>
          <Button
            color="orange"
            appearance="primary"
            onClick={close}
            //href="javascript:window.open('https://www.google.es','','toolbar=yes', 'location=no', 'directories=no', 'status=no','menubar=no', 'scrollbars=no', 'resizable=yes', 'width=650', 'height=450', 'left=0', 'top=0');void 0"
          >
            Aceptar
          </Button>
        </Container>
      ) : (
        <p>error</p>
      )}
    </Container>
  );
}

export default PublicationsDetails;
