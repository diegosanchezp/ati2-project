import { djRequest } from "utils/apirest";

export const getCurrencies = async () => {
  const response = await djRequest("finance/currencies", {
    method: "GET",
  });

  if (response.ok) {
    const { currencies } = await response.json();
    return currencies;
  }
};

