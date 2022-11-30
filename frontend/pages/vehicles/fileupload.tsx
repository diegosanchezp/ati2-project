import React from "react";
import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"
import {
  Uploader,
  Button
} from "rsuite"
import {djRequest, getCSRF} from "utils/apirest";

import {FileType} from "rsuite/Uploader";
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';

type UploadTestPageProps = {};


const UploadTest: PageWithSession<UploadTestPageProps> = (props) => {
  const [fileList, setFileList] = React.useState<FileType[]>([]);
  console.log(fileList);

  async function uploadFile(){
    const {csrfRes, csrfToken} = await getCSRF();
    const formData = new FormData();
    // general formData setup
    formData.append("images-TOTAL_FORMS", '20')
    formData.append("images-INITIAL_FORMS", '0')

    for(let i=0; i<fileList.length; i++){
      const photo = fileList[i];
      formData.append(`images-${i}-vehicle`, "1")
      formData.append(`images-${i}-image`, photo.blobFile);
    }

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
	async getServerSideProps({user}){
    return {
      props: {
        a: "a",
        user: user
      },
    }
  }
})

