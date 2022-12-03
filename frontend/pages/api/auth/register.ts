import {djRequest, getCSRF} from "utils/apirest";

export const handler = async (registerData: any) => {
    const { csrfToken } = await getCSRF();
    try{
      const response = await djRequest("register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken as string,
        },
        body: JSON.stringify(registerData)    
      });
  
      return await response.json();
    }catch(e){
      console.log(e);
      return {'error':'error'}
    }

  }

export default handler;
