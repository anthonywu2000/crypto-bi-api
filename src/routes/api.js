const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController.js");

// TODO: define controllers for each routes
router.get("/coin-markets", ApiController.getCoinMarkets);
router.get("/coins-list", ApiController.getCoinsList);
router.get("/search-trending", ApiController.getTrending);
router.get("/coins-market-chart/:id", ApiController.getCoinChartsInfo);

module.exports = router;