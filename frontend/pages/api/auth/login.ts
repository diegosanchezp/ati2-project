import type { NextApiRequest, NextApiResponse } from "next";
import { splitCookiesString } from "auth";
import { djRequest, getCSRF } from "utils/apirest";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    return;
  }

  const { csrfRes, csrfToken } = await getCSRF();

  const tokenCookie = splitCookiesString(
    csrfRes.headers.get("set-cookie") as string
  )[0];

  // Foward the request
  const djres = await djRequest("login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken as string,
      Cookie: tokenCookie as string,
    },
    body: JSON.stringify(req.body),
  });

  res.status(djres.status);

  if (!djres.ok) {
    const errors = await djres.json();
    res.json(errors);
    return;
  }

  // Foward headers
  res.setHeader(
    "set-cookie",
    splitCookiesString(djres.headers.get("set-cookie") as string)
  );
  const loginBody = await djres.json();
  res.json(loginBody);
};

export default handler;
