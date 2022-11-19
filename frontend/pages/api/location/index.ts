import { djRequest } from "utils/apirest";

export const getCountries = async () => {
  const response = await djRequest("countries", {
    method: "GET",
  });

  if (response.ok) {
    const { countries } = await response.json();
    return countries;
  }
};

export const getStates = async (_countryId: number) => {
  const response = await djRequest(`country/${_countryId}/states`, {
    method: "GET",
  });

  if (response.ok) {
    const { states } = await response.json();
    return states;
  }
};

export const getCities = async (_stateId: number) => {
  const response = await djRequest(`state/${_stateId}/cities`, {
    method: "GET",
  });

  if (response.ok) {
    const { cities } = await response.json();
    return cities;
  }
};
