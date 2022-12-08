import { djRequest, getCSRF } from "utils/apirest";
import { splitCookiesString } from "auth";

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

export const createVehicle = async (_vehicleData: any, _isJSONData = true) => {
  const { csrfToken, csrfRes } = await getCSRF();

  let headers = {
    "Content-Type": "",
    "X-CSRFToken": csrfToken as string,
  };

  if (_isJSONData)
    headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken as string,
    };

  const response = await djRequest("vehicle", {
    method: "POST",
    headers: headers,
    body: _isJSONData ? JSON.stringify(_vehicleData) : _vehicleData,
  });

  if (response.ok) {
    const { success } = await response.json();
    return success;
  } else {
    return { success: false };
  }
};

export const getVehicle = async (_id: string) => {
  const response = await djRequest(`vehicle/${_id}`, {
    method: "GET",
  });

  if (response.ok) {
    const vehicleData = await response.json();
    return vehicleData;
  }
};

export const editVehicle = async (_vehicleData: any, _id: string, _isJSONData = true) => {
  const { csrfToken, csrfRes } = await getCSRF();

  let headers = {
    "Content-Type": "",
    "X-CSRFToken": csrfToken as string,
  };

  if (_isJSONData)
    headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken as string,
    };

  const response = await djRequest(`vehicle/edit/${_id}`, {
    method: "POST",
    credentials: "include",
    headers: headers,
    body: _isJSONData ? JSON.stringify(_vehicleData) : _vehicleData,
  });

  if (response.ok) {
    const { success } = await response.json();
    return success;
  } else {
    return { success: false };
  }
};

/*export const getModels = async (_brandId: number) => {
  const response = await djRequest(`country/${}/states`, {
    method: "GET",
  });

  if (response.ok) {
    const { states } = await response.json();
    return states;
  }
};*/
