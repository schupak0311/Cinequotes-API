import { RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import quoteRepository from "../../models/Quotes";

const all: RequestHandler = async (req, res) => {
  const quotes = await quoteRepository.get();
  res.send({ quotes });
};

export default requestMiddleware(all);
