const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController.js");

// Get a list of all coins with their respective market data,
// including the current price, market capitalization, and
// price change percentage over the past 24 hours.
router.get("/coin-markets", ApiController.getCoinMarkets);

// Get a list of all supported coins on CoinGecko along with their IDs
router.get("/coins-list", ApiController.getCoinsList);

// Get the trending coins on CoinGecko
router.get("/search-trending", ApiController.getTrending);

// Get the market data of a specific coin in the past given number of days
router.get("/coins-market-chart/:id", ApiController.getCoinChartsInfo);

module.exports = router;