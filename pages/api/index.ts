import { name, description, version, homepage } from "../../package.json";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    name: name,
    about: description,
    version: version,
    url: homepage
  });
}
