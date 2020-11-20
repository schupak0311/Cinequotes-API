import bodyParser from "body-parser";
import requestLanguage from "express-request-language";
import cookieParser from "cookie-parser";
import compression from "compression";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import routes from "./routes";

const app = express();

app.use(cookieParser());
app.use(
  requestLanguage({
    languages: ["en-US", "fr-FR"],
    cookie: {
      name: "language",
      options: { maxAge: 24 * 3600 * 1000 },
      url: "/languages/{language}",
    },
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.use(routes);

app.use(
  (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      error: process.env.NODE_ENV === "development" ? err : undefined,
      message: err.message,
    });
  }
);

export default app;
