import { RequestHandler } from "express";
import Joi from "@hapi/joi";
import requestMiddleware from "../../middleware/request-middleware";
import quotesRepository from "../../models/Quotes";
import { createSubscription, publishToTopic } from "../../pubsubClient";

const topicName = "Translate";
const subscriptionName = "quotes_sub";

export const addQuoteSchema = Joi.object().keys({
  title: Joi.string().required(),
  actor: Joi.string().required(),
  quoteEN: Joi.string().required(),
});

const add: RequestHandler = async (req, res) => {
  const quote = await quotesRepository.add(req.body);
  const message = {
    id: quote.document.id,
    quoteEN: quote.document.data.quoteEN,
  };
  const messageId = await publishToTopic(topicName, message);
  await createSubscription(topicName, subscriptionName);
  res.send({
    message: `Message ${messageId} published`,
    quote,
  });
};

export default requestMiddleware(add, { validation: { body: addQuoteSchema } });
