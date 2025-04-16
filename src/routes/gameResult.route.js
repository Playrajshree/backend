const express = require("express");
const { checkRole, authenticateUser } = require("../middlewares/auth.middleware");
const { gameResultValidator, currentGameResultsValidator, RangeOfDateGameResultsValidator } = require("../validators/gameResult.validator");
const { addGameResult, deleteGameResult, getGameResults, getCurrentGameResults, getRangeOfGameResults } = require("../controllers/gameResults.controller");




const resultRouter = express.Router();


resultRouter.post("/add-result", authenticateUser, checkRole("admin"), gameResultValidator, addGameResult);

resultRouter.delete("/delete-result/:id", authenticateUser, checkRole("admin"), deleteGameResult);

resultRouter.get("/get-result", authenticateUser, checkRole("admin"), getGameResults)

resultRouter.get("/get-currentresult", currentGameResultsValidator, getCurrentGameResults);

resultRouter.get("/search-result", RangeOfDateGameResultsValidator, getRangeOfGameResults);



module.exports = resultRouter;