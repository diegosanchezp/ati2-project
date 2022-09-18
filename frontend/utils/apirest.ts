export const createRequester = (baseUrl: string, baseInit: RequestInit = {}) =>{
  const {headers: baseHeaders, ...baseRest} = baseInit

  return (path: string | URL, init: RequestInit={}) => {
    // url object used for validation
    const {headers: initHeaders, ...initRest} = init;
    const url = new URL(`api/${path}`,baseUrl);
    return fetch(
      url,
      {
        credentials: "include",
        headers: {
          ...baseHeaders,
          ...initHeaders,
        },
        ...baseRest,
        ...initRest,
      }
    );
  }
}

// Frontend request client
// TODO: env variable
export const fRequest = createRequester("http://localhost:8000/api");
