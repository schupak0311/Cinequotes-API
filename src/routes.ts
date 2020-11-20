import { Router } from "express";
import * as FilmsController from "./controllers/films";
import * as QuotesController from "./controllers/quotes";

const router = Router();

// Films routes
router.get("/film/all", FilmsController.all);
router.get("/film/:id", FilmsController.getById);
router.post("/film/add", FilmsController.add);

// Quotes routes
router.get("/quote/all", QuotesController.all);
router.post("/quote/add", QuotesController.add);

export default router;
