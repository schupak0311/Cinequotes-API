import { RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import filmsRepository from "../../models/Films";

const all: RequestHandler = async (req, res) => {
  const films = await filmsRepository.get();
  res.send({ films });
};

export default requestMiddleware(all);
