import { Popover, Whisper, Button, Toggle, Container } from "rsuite";
import React from "react";
import { useRouter } from "next/router";

function PublicationsVideos(props: any) {
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
  };
  function close() {
    window.open("", "_parent", "");
    window.close();
  }
  return (
    <Container id="publications-windows-videos">
      <Container id="publications-vehicle-videos">
        <Container>
          <img src={vehicle.images[0]}></img>
        </Container>
        <Container>
          <p>
            <b>{vehicle.salePrice} USD</b>
          </p>
        </Container>
        <Container>
          <Container id="publications-window-vehicle-info">
            <p style={{ color: "#2589f5" }}>
              {vehicle.brand}-{vehicle.model}
            </p>
            <p style={{ color: "#eb3626" }}>{vehicle.year}</p>
            <p style={{ color: "#eb3626" }}>{vehicle.contrattype}</p>
          </Container>
          <Container>
            <p>
              <b>Pais: </b>
              {vehicle.address.country}
            </p>
            <p>
              <b>Ciudad: </b>
              {vehicle.address.city}
            </p>
            <p>
              <b>Zona: </b>
              {vehicle.address.address}
            </p>
          </Container>
        </Container>
      </Container>
      <p id="publications-window-subtitle">
        <b>Videos</b>
      </p>
      <Container id="publications-grid-videos">
        {vehicle.videos.map((video) => (
          <Container>
            <video controls>
              <source src={video.url} type="video/mp4" />{" "}
            </video>
          </Container>
        ))}
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

export default PublicationsVideos;
