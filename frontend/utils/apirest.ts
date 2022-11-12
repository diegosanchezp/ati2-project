export const createRequester = (baseUrl?: string, baseInit: RequestInit = {}) =>{
  const {headers: baseHeaders, ...baseRest} = baseInit

  return (path: string | URL, init: RequestInit={}) => {
    // url object used for validation
    const {headers: initHeaders, ...initRest} = init;
    //const url = new URL(`api/${path}`,baseUrl);
    return fetch(
    `${baseUrl}/${path}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...baseHeaders,
          ...initHeaders,
        },
        ...baseRest,
        ...initRest,
      }
    );
  }
}

// Pre configured function for making http request to django api
// TODO: env variable
export const djRequest = createRequester("http://localhost:8000/api");
// Pre configured function for making http request to next api routes, api base url is relative
export const nextRequest = createRequester("http://localhost:3000/api");


export const getCSRF = async () => {

  const csrfRes = await djRequest("csrf");
  const csrfToken = csrfRes.headers.get("X-CSRFToken");

  return {
    csrfRes,
    csrfToken,
  }
}
