import "@/styles/custom/index.less";

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

import "react-phone-number-input/style.css";

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

import PhoneInput, {Value as PhoneInputValue} from "react-phone-number-input";

type formSet = {
    prefix: string,
    [key: string]: string
}
type VehicleSerializer = OriginalVehicleSerializer & {
  countries: CountriesSerializer[];
  states: StatesSerializer[];
  cities: CitiesSerializer[];
  images: formSet;
  videos: formSet;
  contact_phone_numbers: formSet;
  contact_hour_to_system?: string;
  contact_hour_from_system?: string;
};

type UploadTestPageProps = {

  vehicleData: VehicleSerializer;
};


type GetFileListParams = {
  regex: RegExp
  formset: formSet
};

const indexRegex = /[0-9]+/

function getFileList(params: GetFileListParams){
  const {regex, formset} = params;
  return Object.keys(formset).filter(key => regex.test(key)).map((key)=>{
    return {
      url: `http://127.0.0.1:8000${formset[key]}`,
      index: key.match(indexRegex)[0], // Get the index from the key
    } as FileType
  })
}

type GetFormsetKeyRegexParams = {
  fieldname: string
  prefix: string
}

function getFormsetKeyRegex(params: GetFormsetKeyRegexParams): RegExp {
  const {fieldname, prefix} = params;
  return new RegExp(`${prefix}-([0-9])+-${fieldname}`, 'g');
}

const UploadTest: PageWithSession<UploadTestPageProps> = (props) => {
  const vehicleId = 1;
  const {countries, states, cities, ...vehicleData} = props.vehicleData;
  const telephoneFormPrefix = vehicleData.contact_phone_numbers.prefix;
  // Esta expresion regular la utilizas para obtener
  // los datos de los telefonos
  const telephoneKeyRegex = new RegExp(`${telephoneFormPrefix}-[0-9]+-[a-z]+`);
  const telephoneDataKey = Object.keys(vehicleData.contact_phone_numbers).filter(key=>telephoneKeyRegex.test(key));

  const [formState, setFormState] = React.useState(vehicleData);
  const imagePrefix = vehicleData.images.prefix;
  
  const imageUrlRegex = getFormsetKeyRegex({prefix: imagePrefix, fieldname: "image"});

  // Obtener los keys de un tipo de telephone
  function getVehicleNumberPhone(_type: string){
    const { contact_phone_numbers } = vehicleData;
    let index;
    for(let i = 0; i < parseInt(contact_phone_numbers[`${telephoneFormPrefix}-TOTAL_FORMS`]); i++){
      if(contact_phone_numbers[`${telephoneFormPrefix}-${i}-ptype`] === _type){
        index = i;
        break
      }
    }

    if (index === undefined) return
    const indexPrefix = `${telephoneFormPrefix}-${index}`;
    return {
      [`${indexPrefix}-number`]: contact_phone_numbers[`${indexPrefix}-number`],
      [`${indexPrefix}-country_number`]: contact_phone_numbers[`${indexPrefix}-country_number`],
      [`${indexPrefix}-ext`]: contact_phone_numbers[`${indexPrefix}-ext`],
      [`${indexPrefix}-ptype`]: contact_phone_numbers[`${indexPrefix}-ptype`],
      [`${indexPrefix}-id`]: contact_phone_numbers[`${indexPrefix}-id`],
      [`${indexPrefix}-DELETE`]: contact_phone_numbers[`${indexPrefix}-DELETE`]
    }
  }

  // Mapear formset data a fileType para poder ser
  // usado por el componente Uploader
  const [fileList, setFileList] = React.useState<FileType[]>(
    getFileList({
      formset: vehicleData.images,
      regex: imageUrlRegex
    })
  );

  const videoPrefix = vehicleData.videos.prefix;
  const [videoFileList, setVideosFiles] = React.useState<FileType[]>(
    getFileList({formset: vehicleData.videos, regex: getFormsetKeyRegex({fieldname: "video", prefix: videoPrefix})})
  );

  const [phoneNumber, setPhoneNumber] = React.useState<PhoneInputValue>("")
  // Descomentar esto para debuggear
  // console.log(fileList);
  // console.log(formState.videos);

  console.log(phoneNumber);
  // Alguno de estos dos numeros deberia de obtenerse
  // console.log(getVehicleNumberPhone("MOBILE"));
  // console.log(getVehicleNumberPhone("FIXED"));

  function onPhoneNumChange(value: PhoneInputValue){
    setPhoneNumber(value);
  }

  // Borrar imagen que ya esta en base de datos
  function removeFile(params: {stateKey: string, prefix: string}){
    const {stateKey, prefix} = params;
    return (file: FileType) => {
      if(!file.index) return
      setFormState((prevState)=>{
        return {
          ...prevState,
          [stateKey]: {
            ...prevState[stateKey],
            [`${prefix}-${file.index}-DELETE`]: "on"
          }
        }
      })
    }
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
       porque le a??ad?? 5 propiedades adicionales
       que sirven de metadata
     */
    let nextId = (Object.keys(formState.images).length - 5) / 4;
    let nextVideoId = (Object.keys(formState.videos).length - 5) / 4

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

    for (const [key, value] of Object.entries(formState.videos)) {
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

    for (const file of videoFileList){

      const keyPrefix = `${videoPrefix}-${nextVideoId}`

      // Salir del ciclo si vemos una imagen que ya esta
      // en Base de datos
      if(file.index){continue}

      formData.append(`${keyPrefix}-video`, file.blobFile),
      formData.append(`${keyPrefix}-vehicle`, String(vehicleId))
      nextVideoId++;
    }

    // Actualizar el numero de formularios que se envian
    formData.set(`${videoPrefix}-TOTAL_FORMS`,String(nextVideoId))

    // Actualizar el numero de formularios de telphones
    // 6 es el numero de propiedades de un telephone
    const phoneNum = (Object.keys(formState.contact_phone_numbers).length - 5) / 6;
    for(const [key, value] of Object.entries(formState.contact_phone_numbers)){
      formData.append(key, value ? value : "");
    }
    // Add fixed phone number for testing

    const fixedPhonePrefix = `${telephoneFormPrefix}-${phoneNum}`;
    formData.append(`${fixedPhonePrefix}-number`, phoneNumber)
    formData.append(`${fixedPhonePrefix}-country_number`, "58")
    formData.append(`${fixedPhonePrefix}-ext`, "")
    formData.append(`${fixedPhonePrefix}-ptype`, "FIXED")

    // Faltaria hacer esto
    formData.set(`${telephoneFormPrefix}-TOTAL_FORMS`, String(phoneNum + 1));

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

  // Test for vehicle creation
  async function createVehicle(){

    const formData = new FormData();

    // Core vehicle fields
    formData.append("location_city", "149261");
    formData.append("model", "7");
    formData.append("type_vehicle", "CAR");
    formData.append("contact_days", JSON.stringify(["friday", "saturday"]))
    formData.append("contract_type", "");
    formData.append("status", "NEW");
    formData.append("details", "fancycar");
    formData.append("accessories", "electric accessories");
    formData.append("publication_enabled", "on");
    formData.append("init_publication_date", "2022-11-30")
    formData.append("finish_publication_date", "2022-11-30")
    formData.append("location_zone", "d")
    formData.append("exact_location", "e")
    formData.append("rental_price", "10.0")
    formData.append("sale_price", "10.0")
    formData.append("contact_first_name", "Diego")
    formData.append("contact_last_name", "Sanchez")
    formData.append("contact_email", "dsanchez@gmail.com")
    formData.append("currency", "2");
    formData.append("contact_hour_from", "15:30:39")
    formData.append("contact_hour_to", "15:30:41")
    formData.append("year", "2022-11-25")
    formData.append("contract_type", "RENTAL")

    // Telephone phone numbers
    formData.append(`${telephoneFormPrefix}-0-number`, "123213122")
    formData.append(`${telephoneFormPrefix}-0-country_number`, "58")
    formData.append(`${telephoneFormPrefix}-0-ext`, "")
    formData.append(`${telephoneFormPrefix}-0-ptype`, "MOBILE")
    formData.append(`${telephoneFormPrefix}-TOTAL_FORMS`, "1")
    formData.append(`${telephoneFormPrefix}-INITIAL_FORMS`, "0")

    // Images
    // Requires at least one image in the <Uploader /> Component,
    // To test delete all the images in <Uploader /> Component and add them again
    // Otherwise the fileType wont have its blobFile property set

    for (let i=0 ; i<fileList.length; i++){
      const file = fileList[i];
      formData.append(`${imagePrefix}-${i}-image`, file.blobFile as File);
      // No se le pone el vehicle-id, porque estamos creando
      // Ya en el backend se le asocia, cuando se cree.
    }

    formData.set(`${imagePrefix}-TOTAL_FORMS`,String(fileList.length));
    formData.set(`${imagePrefix}-INITIAL_FORMS`,String(0));

    // Videos
    // Requires at least one video in the <Uploader /> Component,
    // To test delete all the videos in <Uploader /> Component and add them again
    // Otherwise the fileType wont have its blobFile property set
    for (let i=0 ; i<videoFileList.length; i++){
      const file = videoFileList[i];
      formData.append(`${videoPrefix}-${i}-video`, file.blobFile as File);
    }

    formData.set(`${videoPrefix}-TOTAL_FORMS`,String(videoFileList.length));
    formData.set(`${videoPrefix}-INITIAL_FORMS`,String(0));

    const {csrfToken} = await getCSRF();

    const res = await fetch(
          `http://localhost:8000/api/vehicle/create`, {
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
      <PhoneInput
        placeholder="Enter phone number"
        className="phone-number-input"
        value={phoneNumber}
        onChange={onPhoneNumChange}/>

      <Uploader
        multiple
        autoUpload={false}
        listType="picture"
        fileList={fileList}
        onChange={setFileList}
        onRemove={removeFile({prefix: imagePrefix, stateKey: "images"})}
        action="">
        <button>
          <CameraRetroIcon />
        </button>
      </Uploader>

      <p>Videos</p>
      <Uploader
        multiple
        autoUpload={false}
        listType="picture"
        fileList={videoFileList}
        onChange={setVideosFiles}
        onRemove={removeFile({prefix: videoPrefix, stateKey: "videos"})}
        action="">
        <button>
          <CameraRetroIcon />
        </button>
      </Uploader>

      <Button onClick={uploadFile}>
        Upload Files
      </Button>
      <Button onClick={createVehicle}>
        Create Vehicle
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

