import { djRequest, getCSRF } from "utils/apirest";
import {splitCookiesString} from "auth";

export const getVehiclesBrands = async () => {
  const response = await djRequest("vehicle/brands", {
    method: "GET",
  });

  if (response.ok) {
    const { brands } = await response.json();
    return brands;
  }
};

export const getVehiclesModels = async () => {
    const response = await djRequest("vehicle/models", {
      method: "GET",
    });
  
    if (response.ok) {
      const { models } = await response.json();
      return models;
    }
  };

export const createVehicle = async (_vehicleData: any) => {
  const { csrfToken, csrfRes } = await getCSRF();

  const response = await djRequest("vehicle/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken as string,
    },
    body: JSON.stringify({ vehicle: _vehicleData})    
  });

  if (response.ok) {
    const { success } = await response.json();
    console.log(success)
    return success;
  }
}
