const axios = require("axios");

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

class ApiController {
  constructor() {}
  
  /**
   * Get a list of all coins with their respective market data,
   * including the current price, market capitalization, and
   * price change percentage over the past 24 hours.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object[]} - Array of objects containing data for each coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getCoinMarkets(req, res) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
        params: { vs_currency: "usd", per_page: 250 },
      });
      const responseData = response.data.map((coinData) => ({
        id: coinData.id,
        name: coinData.name,
        image: coinData.image,
        current_price: coinData.current_price,
        market_cap: coinData.market_cap,
        price_change_percentage_24h: coinData.price_change_percentage_24h,
        market_cap_change_percentage_24h:
          coinData.market_cap_change_percentage_24h,
      }));
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  /**
   * Get a list of all supported coins on CoinGecko along with their IDs
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object[]} - Array of objects containing { id, name } for each coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getCoinsList(req, res) {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/list`);
        const responseData = response.data.map((coin) => ({
            id: coin.id,
            name: coin.name
        }));
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
  }
  /**
   * Get the trending coins on CoinGecko
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object[]} - Array of objects containing { id, name, market_cap_rank, price, market_cap } for each trending coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getTrending(req, res) {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/search/trending`);
        const responseData = response.data.coins.map((coin) => ({
            id: coin.item.id,
            name: coin.item.name,
            market_cap_rank: coin.item.market_cap_rank,
            price: coin.item.data.price,
            market_cap:  coin.item.data.market_cap
        }));
        responseData.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
  }

  /**
   * Get the market data of a specific coin in the past given number of days
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {String} req.params.id - The id of the coin to get the data for
   * @param {Number} req.query.daysBefore - The number of days to get the market data for
   * @returns {Number[][]} - Array of arrays containing [time, price] for the given coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getCoinChartsInfo(req, res) {
    const { id } = req.params;
    const { daysBefore } = req.query;
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: daysBefore
        }
      });
      const responseData = response.data.prices;
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

module.exports = new ApiController();
