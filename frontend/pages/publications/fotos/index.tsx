import { Popover, Whisper, Button, Toggle, Container } from "rsuite";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { djRequest } from "utils/apirest";

import { withTranslations } from "utils/i18n";
import { useTranslations } from "next-intl";
export const getServerSideProps = withTranslations({
  // use translations located in
  // translations/auth
  folderPath: "publications",
});

function PublicationsFotos(props: any) {
  const baseURL = "http://localhost:8000";

  const router = useRouter();
  const Tw = useTranslations();
  //console.log("query id ", router.query.id);
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
        //console.log("vehicle ", data);
        setVehicle(data.vehicle);

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
                <p style={{ color: "#eb3626" }}>
                  {vehicle.contract_type === "SALE"
                    ? Tw("cards.contrat-type.sell")
                    : vehicle.contract_type === "RENTAL"
                    ? Tw("cards.contrat-type.rental")
                    : Tw("cards.contrat-type.sell-rental")}
                </p>
              </Container>
              <Container>
                <p>
                  <b>{Tw("cards.addres.country")}: </b>
                  {vehicle.location_city.location.split(">")[0]}
                </p>
                <p>
                  <b>{Tw("cards.addres.city")}: </b>
                  {vehicle.location_city.name}
                </p>
                <p>
                  <b>{Tw("cards.addres.city")}: </b>
                  {vehicle.location_zone}
                </p>
              </Container>
            </Container>
          </Container>
          {vehicle.images.length > 0 ? (
            <Container>
              <p id="publications-window-subtitle">
                <b>{Tw("windows.photos")}</b>
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
            {Tw("windows.button")}
          </Button>
        </Container>
      ) : (
        <p>error</p>
      )}
    </Container>
  );
}

export default PublicationsFotos;
