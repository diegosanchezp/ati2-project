import type { NextApiRequest, NextApiResponse } from 'next'
import {getSession} from "auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const {method} = req;
  if(method !== "GET"){
    return
  }

  const session = await getSession(req);

  if(!session){
    res.json(null) ;
  }

  res.json(session);
}

export default handler;
