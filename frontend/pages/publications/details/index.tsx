import { Popover, Whisper, Button, Toggle, Container } from "rsuite";
import React from "react";
import { useRouter } from "next/router";

function PublicationsDetails(props: any) {
  const router = useRouter();

  const videos = [
    {
      url: "https://rr2---sn-hp57ynee.googlevideo.com/videoplayback?expire=1668897860&ei=5Ad5Y7fQDtOUhwb88KjACg&ip=168.196.237.169&id=o-AAYfgN4eCr14Qfie3zHYPowiDMcRMgnIw6DWh96V2fzs&itag=18&source=youtube&requiressl=yes&spc=SFxXNoT7npTZ70q1p3ZK3ny3DzVhh24&vprv=1&xtags=heaudio%3Dtrue&mime=video%2Fmp4&ns=-JULaBT4qg2nLGAsUqb_Of0J&cnr=14&ratebypass=yes&dur=336.364&lmt=1665220548119248&fexp=24001373,24007246&c=WEB&txp=5538434&n=7Ft8KB9xtNjjZQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cxtags%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgD3aFRtU27QKUHMdfy54B6XHQPsuGGUA1BS2Ce1VcVTYCIEP4mBJXOCAybsfrz16J-9KhKuT_9R-fdAOmZY577h_z&rm=sn-p5qeed76&req_id=daee8b14d643a3ee&ipbypass=yes&redirect_counter=2&cm2rm=sn-j5ou8-jjnd7s&cms_redirect=yes&cmsv=e&mh=RA&mip=190.39.171.153&mm=30&mn=sn-hp57ynee&ms=nxu&mt=1668876034&mv=m&mvi=2&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAJWWuX1CuixLBY0yaZ-MKTvaD_F0ygccebVQJvXPAUFpAiEA-tRiBHW9ERdRAiqo_pQ-hTvXYF511XEDUjq-edMFHVc%3D",
    },
    {
      url: "https://rr2---sn-hp57ynee.googlevideo.com/videoplayback?expire=1668897860&ei=5Ad5Y7fQDtOUhwb88KjACg&ip=168.196.237.169&id=o-AAYfgN4eCr14Qfie3zHYPowiDMcRMgnIw6DWh96V2fzs&itag=18&source=youtube&requiressl=yes&spc=SFxXNoT7npTZ70q1p3ZK3ny3DzVhh24&vprv=1&xtags=heaudio%3Dtrue&mime=video%2Fmp4&ns=-JULaBT4qg2nLGAsUqb_Of0J&cnr=14&ratebypass=yes&dur=336.364&lmt=1665220548119248&fexp=24001373,24007246&c=WEB&txp=5538434&n=7Ft8KB9xtNjjZQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cxtags%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgD3aFRtU27QKUHMdfy54B6XHQPsuGGUA1BS2Ce1VcVTYCIEP4mBJXOCAybsfrz16J-9KhKuT_9R-fdAOmZY577h_z&rm=sn-p5qeed76&req_id=daee8b14d643a3ee&ipbypass=yes&redirect_counter=2&cm2rm=sn-j5ou8-jjnd7s&cms_redirect=yes&cmsv=e&mh=RA&mip=190.39.171.153&mm=30&mn=sn-hp57ynee&ms=nxu&mt=1668876034&mv=m&mvi=2&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAJWWuX1CuixLBY0yaZ-MKTvaD_F0ygccebVQJvXPAUFpAiEA-tRiBHW9ERdRAiqo_pQ-hTvXYF511XEDUjq-edMFHVc%3D",
    },
    {
      url: "https://rr2---sn-hp57ynee.googlevideo.com/videoplayback?expire=1668897860&ei=5Ad5Y7fQDtOUhwb88KjACg&ip=168.196.237.169&id=o-AAYfgN4eCr14Qfie3zHYPowiDMcRMgnIw6DWh96V2fzs&itag=18&source=youtube&requiressl=yes&spc=SFxXNoT7npTZ70q1p3ZK3ny3DzVhh24&vprv=1&xtags=heaudio%3Dtrue&mime=video%2Fmp4&ns=-JULaBT4qg2nLGAsUqb_Of0J&cnr=14&ratebypass=yes&dur=336.364&lmt=1665220548119248&fexp=24001373,24007246&c=WEB&txp=5538434&n=7Ft8KB9xtNjjZQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cxtags%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgD3aFRtU27QKUHMdfy54B6XHQPsuGGUA1BS2Ce1VcVTYCIEP4mBJXOCAybsfrz16J-9KhKuT_9R-fdAOmZY577h_z&rm=sn-p5qeed76&req_id=daee8b14d643a3ee&ipbypass=yes&redirect_counter=2&cm2rm=sn-j5ou8-jjnd7s&cms_redirect=yes&cmsv=e&mh=RA&mip=190.39.171.153&mm=30&mn=sn-hp57ynee&ms=nxu&mt=1668876034&mv=m&mvi=2&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAJWWuX1CuixLBY0yaZ-MKTvaD_F0ygccebVQJvXPAUFpAiEA-tRiBHW9ERdRAiqo_pQ-hTvXYF511XEDUjq-edMFHVc%3D",
    },
    {
      url: "https://rr2---sn-hp57ynee.googlevideo.com/videoplayback?expire=1668897860&ei=5Ad5Y7fQDtOUhwb88KjACg&ip=168.196.237.169&id=o-AAYfgN4eCr14Qfie3zHYPowiDMcRMgnIw6DWh96V2fzs&itag=18&source=youtube&requiressl=yes&spc=SFxXNoT7npTZ70q1p3ZK3ny3DzVhh24&vprv=1&xtags=heaudio%3Dtrue&mime=video%2Fmp4&ns=-JULaBT4qg2nLGAsUqb_Of0J&cnr=14&ratebypass=yes&dur=336.364&lmt=1665220548119248&fexp=24001373,24007246&c=WEB&txp=5538434&n=7Ft8KB9xtNjjZQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cxtags%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgD3aFRtU27QKUHMdfy54B6XHQPsuGGUA1BS2Ce1VcVTYCIEP4mBJXOCAybsfrz16J-9KhKuT_9R-fdAOmZY577h_z&rm=sn-p5qeed76&req_id=daee8b14d643a3ee&ipbypass=yes&redirect_counter=2&cm2rm=sn-j5ou8-jjnd7s&cms_redirect=yes&cmsv=e&mh=RA&mip=190.39.171.153&mm=30&mn=sn-hp57ynee&ms=nxu&mt=1668876034&mv=m&mvi=2&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAJWWuX1CuixLBY0yaZ-MKTvaD_F0ygccebVQJvXPAUFpAiEA-tRiBHW9ERdRAiqo_pQ-hTvXYF511XEDUjq-edMFHVc%3D",
    },
  ];
  const vehicle = {
    id: 1,
    videos,
    images: [
      "https://elestimulo.com/wp-content/uploads/2022/08/CS_15-3-scaled.jpg",
      "https://multimarca.com.ve/wp-content/uploads/2020/05/Chevrolet-Onix.jpg",
    ],
    year: "2010",
    salePrice: 100,
    rentPrice: 20,
    address: { country: "Vzla", city: "Caracas", address: "bla bla bla bla" },
    brand: "bmw",
    model: "2x",
    contrattype: "RENTAL_SALE",
    status: "new",
    details: {
      motor: "Motor 8 cilindros",
      traccion: "4x4",
      transmicion: "Transmicion sincronica",
    },
  };
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
      <Container className="publications-windows-details-section">
        <p className="publications-windows--details-subtitle">
          <b>Detalles del vehículo</b>
        </p>
        <Container>
          <ul className="publications-windows-details-section-list-none">
            <li>
              <p>{vehicle.details.motor}</p>
              <p>{vehicle.details.traccion}</p>
              <p>{vehicle.details.transmicion}</p>
            </li>
          </ul>
        </Container>
      </Container>
      <Container className="publications-windows-details-section">
        <p className="publications-windows--details-subtitle">
          <b>Accesorios y comodidades</b>
        </p>
        <Container className="publications-windows-details-section-box">
          <p className="publications-windows--details-sub-subtitle">
            <b>Interior del vehículo</b>
          </p>
          <ul className="publications-windows-details-section-list">
            <li>
              <p>{vehicle.details.motor}</p>
            </li>
            <li>
              <p>{vehicle.details.traccion}</p>
            </li>
            <li>
              <p>{vehicle.details.transmicion}</p>
            </li>
          </ul>
          <p className="publications-windows--details-sub-subtitle">
            <b>Exteior del vehículo</b>
          </p>
          <ul className="publications-windows-details-section-list">
            <li>
              <p>{vehicle.details.motor}</p>
            </li>
            <li>
              <p>{vehicle.details.traccion}</p>
            </li>
            <li>
              <p>{vehicle.details.transmicion}</p>
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
              href="test"
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
              href="test"
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
            <p>{vehicle.details.motor}</p>
            <p>{vehicle.details.traccion}</p>
            <p>{vehicle.details.transmicion}</p>
          </li>
        </ul>
      </Container>
      <Container className="publications-windows-details-section">
        <p className="publications-windows--details-subtitle">
          <b>Ubicación exacta y comodidades</b>
        </p>
        <Container className="publications-windows-details-section-box">
          <p>lorem ipsum bla bla bla bla bla</p>
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
  );
}

export default PublicationsDetails;
