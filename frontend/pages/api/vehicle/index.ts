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

export const getVehiclesModelsByBrand = async (_id: string) => {
  const response = await djRequest(`vehicle/brand/${_id}/models`, {
    method: "GET",
  });

  if (response.ok) {
    const { models } = await response.json();
    return models;
  }
};

export const createVehicle = async (_vehicleData: any) => {
  const { csrfToken } = await getCSRF();

  const response = await fetch("http://localhost:8000/api/vehicle/create", {
    method: "POST",
    body: _vehicleData,
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken as string,
    },
  });

  if (response.ok) {
    const { message } = await response.json();
    return { success: message === "success" };
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

export const editVehicle = async (_vehicleData: any, _id: string) => {
  const { csrfToken } = await getCSRF();

  const response = await fetch(
    `http://localhost:8000/api/vehicle/edit/${_id}`,
    {
      method: "POST",
      body: _vehicleData,
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken as string,
      },
    }
  );

  if (response.ok) {
    const { message } = await response.json();
    return { success: message === "success" };
  } else {
    return { success: false };
  }
};
