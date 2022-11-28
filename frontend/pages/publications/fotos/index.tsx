import { Popover, Whisper, Button, Toggle, Container } from "rsuite";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { djRequest } from "utils/apirest";

function PublicationsFotos(props: any) {
  const baseURL = "http://localhost:8000";
  enum contractTypeEnum {
    SALE = "SALE",
    RENTAL = "RENTAL",
    RENTAL_SALE = "RENTAL_SALE",
  }
  enum contractTypeEnumES {
    SALE = "Venta",
    RENTAL = "Renta",
    RENTAL_SALE = "Venta y Renta",
  }
  const router = useRouter();
  console.log("query id ", router.query.id);
  const vehicleId = router.query.id;
  const [vehicle, setVehicle] = useState();
  const [contractType, setcontractType] = useState("");

  //console.log(router);

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

        let auxContractType = contractTypeEnumES.RENTAL_SALE;
        if (vehicle === contractTypeEnum.RENTAL)
          auxContractType = contractTypeEnumES.RENTAL;
        if (vehicle === contractTypeEnum.SALE)
          auxContractType = contractTypeEnumES.SALE;

        setcontractType(auxContractType);

        return data;
      }
    };

    fetchData();
  }, [vehicleId]);

  function close() {
    window.open("", "_parent", "");
    window.close();
  }
  return (
    <Container id="publications-windows-fotos">
      {vehicle ? (
        <Container>
          <Container id="publications-vehicle-fotos">
            <Container>
              <img
                src={
                  vehicle.images[0]?.image
                    ? `${baseURL}${vehicle.images[0].image}`
                    : "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
                }
              ></img>
            </Container>
            <Container>
              <p>
                <b>
                  {vehicle.sale_price} {vehicle.currency.code}
                </b>
              </p>
            </Container>
            <Container>
              <Container id="publications-window-vehicle-info">
                <p style={{ color: "#2589f5" }}>
                  {vehicle.model.brand.name}-{vehicle.model.name}
                </p>
                <p style={{ color: "#eb3626" }}>{vehicle.year.slice(0, 4)}</p>
                <p style={{ color: "#eb3626" }}>{contractType}</p>
              </Container>
              <Container>
                <p>
                  <b>Pais: </b>
                  {vehicle.location_city.location.split(">")[0]}
                </p>
                <p>
                  <b>Ciudad: </b>
                  {vehicle.location_city.name}
                </p>
                <p>
                  <b>Zona: </b>
                  {vehicle.location_zone}
                </p>
              </Container>
            </Container>
          </Container>
          {vehicle.images.length > 0 ? (
            <Container>
              <p id="publications-window-subtitle">
                <b>Fotos</b>
              </p>
              <Container id="publications-grid-fotos">
                {vehicle.images.map((image) => (
                  <Container>
                    <img src={`${baseURL}${image.image}`}></img>
                  </Container>
                ))}
              </Container>
            </Container>
          ) : (
            <Container></Container>
          )}

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

export default PublicationsFotos;
