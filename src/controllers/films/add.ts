import { RequestHandler } from "express";
import Joi from "@hapi/joi";
import requestMiddleware from "../../middleware/request-middleware";
import filmsRepository from "../../models/Films";

export const addFilmSchema = Joi.object().keys({
  title: Joi.string().required(),
});

const add: RequestHandler = async (req, res) => {
  const film = await filmsRepository.add(req.body);

  res.send({
    film,
  });
};

export default requestMiddleware(add, { validation: { body: addFilmSchema } });
