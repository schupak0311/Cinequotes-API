import { RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import filmsRepository from "../../models/Films";
import quotesRepository from "../../models/Quotes";
import { Condition, Operators } from "../../repository/FirebaseRepository";

const getById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const film: any = await filmsRepository.getById(String(id));
  const condition: Condition = {
    field: "title",
    operator: Operators.Equal,
    value: film.data.title,
  };
  const filmQuotes = await quotesRepository.get([condition]);
  if (filmQuotes.length) film.quotes = filmQuotes;
  res.send({ film });
};

export default requestMiddleware(getById);
