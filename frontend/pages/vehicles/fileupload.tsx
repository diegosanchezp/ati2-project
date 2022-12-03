import React from "react";
import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"
import type {
  VehicleGetSerializer,
  VehicleSerializer as OriginalVehicleSerializer,
} from "djtypes/vehicle";
import type {
  CitiesSerializer,
  StatesSerializer,
  CountriesSerializer,
} from "djtypes/country";

import {
  Uploader,
  Button
} from "rsuite"
import {djRequest, getCSRF} from "utils/apirest";

import {FileType as OFileType} from "rsuite/Uploader";
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';

type FileType = OFileType & {
  index: string
}

type VehicleSerializer = OriginalVehicleSerializer & {
  countries: CountriesSerializer[];
  states: StatesSerializer[];
  cities: CitiesSerializer[];
  images: {
    prefix: string,
    [key: string]: string
  }
  videos: {
    prefix: string,
    [key: string]: string | number
  }
  contact_hour_to_system?: string;
  contact_hour_from_system?: string;
};

type UploadTestPageProps = {

  vehicleData: VehicleSerializer;
};


const UploadTest: PageWithSession<UploadTestPageProps> = (props) => {
  const vehicleId = 1;
  const {countries, states, cities, ...vehicleData} = props.vehicleData;

  const [formState, setFormState] = React.useState(vehicleData);

  const imagePrefix = vehicleData.images.prefix;
  const imageUrlRegex = new RegExp(`${imagePrefix}-([0-9])+-image`, 'g');

  // Mapear formset data a fileType para poder ser
  // usado por el componente Uploader
  const [fileList, setFileList] = React.useState<FileType[]>(
    Object.keys(vehicleData.images).filter(key => imageUrlRegex.test(key)).map((key)=>{
      return {
        url: `http://127.0.0.1:8000${vehicleData.images[key]}`,
        index: key.match(/[0-9]+/)[0], // Get the index from the key
      } as FileType
    })
  );

  console.log(fileList);
  console.log(formState.images);

  // Borrar imagen que ya esta en base de datos
  function removeImage(file: FileType){
    if(!file.index) return
    setFormState((prevState)=>{
      return {
        ...prevState,
        images: {
          ...prevState.images,
          [`${imagePrefix}-${file.index}-DELETE`]: "on"
        }
      }
    })
  }

  async function uploadFile(){
    const {csrfRes, csrfToken} = await getCSRF();
    const formData = new FormData();

    // Setup vehicle foreing key data
    formData.append("model", String(formState.model.id))
    formData.append("contact_days", JSON.stringify(formState.contact_days))
    formData.append("currency", formState.currency.id)
    formData.append("location_city", String(formState.location_city.id))

    /* Hay que restarle 5 al arreglo de keys
       porque le añadí 5 propiedades adicionales
       que sirven de metadata
     */
    let nextId = (Object.keys(formState.images).length - 5) / 4;

    for(const [key, value] of Object.entries(formState)){
      // Saltar las propiedades que son objetos
      if(typeof value ==="object"){
        continue
      }
      formData.append(key, value)
    }

    for (const [key, value] of Object.entries(formState.images)) {
      // El null de DELETE hay que convertirlo a un string vacio
      // Si no la imagen se borra
      formData.append(key, value ? value : "");
    }

    for (const file of fileList){

      const keyPrefix = `${imagePrefix}-${nextId}`

      // Salir del ciclo si vemos una imagen que ya esta
      // en Base de datos
      if(file.index){continue}

      formData.append(`${keyPrefix}-image`, file.blobFile),
      formData.append(`${keyPrefix}-vehicle`, String(vehicleId))
      nextId++;
    }

    // Actualizar el numero de formularios que se envian
    formData.set(`${imagePrefix}-TOTAL_FORMS`,String(nextId))

    debugger;
    const res = await fetch(
          `http://localhost:8000/api/vehicle/edit/${1}`, {
          method: 'POST',
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken as string,
          }
        }
    )
  }

  return (
    <>
      <Uploader
        multiple
        autoUpload={false}
        listType="picture"
        fileList={fileList}
        onChange={setFileList}
        onRemove={removeImage}
        action="">
        <button>
          <CameraRetroIcon />
        </button>
      </Uploader>
      <Button onClick={uploadFile}>
        Upload Files
      </Button>

    </>
  );
};

export default UploadTest;
export const getServerSideProps = withAuth<UploadTestPageProps>({
	async getServerSideProps({user, djRequest}){
    const response = await djRequest(`api/vehicle/${1}`, {
      method: "GET",
    });

    const data = await response.json();

    return {
      props: {
        a: "a",
        vehicleData: data,
        user: user
      },
    }
  }
})

