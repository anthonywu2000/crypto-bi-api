const axios = require("axios");
const redisClient = require("../redisClient");

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

class ApiController {
  constructor() { }

  /**
   * Get a list of all coins with their respective market data,
   * including the current price, market capitalization, and
   * price change percentage over the past 24 hours.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object[]} - Array of objects containing { id, name, image, current_price, market_cap, price_change_percentage_24h, market_cap_change_percentage_24h } for each coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getCoinMarkets(req, res) {
    try {
      let cachedCoinMarkets = await redisClient.get("coin_markets_usd");
      let responseData = {};
      if (cachedCoinMarkets) {
        responseData = JSON.parse(cachedCoinMarkets);
      } else {
        const perPage = 250;
        const maxPages = 3; // 3 pages to fetch concurrently at once

        // helper functtion to fetch pages given the pageNumber
        const fetchPage = async (pageNum) => {
          const response = await axios.get(
            `${COINGECKO_BASE_URL}/coins/markets`,
            {
              params: {
                vs_currency: "usd",
                per_page: perPage,
                precision: 4,
                page: pageNum,
              },
            }
          );
          const results = response.data.map((coinData) => ({
            id: coinData.id,
            name: coinData.name,
            image: coinData.image,
            current_price: coinData.current_price,
            market_cap: coinData.market_cap,
            price_change_percentage_24h: coinData.price_change_percentage_24h,
            market_cap_change_percentage_24h:
              coinData.market_cap_change_percentage_24h,
          }));
          return results;
        };

        // fetch 3 pages concurrently
        const promises = [];
        for (let i = 1; i <= maxPages; i++) {
          promises.push(fetchPage(i));
        }

        // wait for all promises to resolve
        const res = await Promise.all(promises);

        // res.forEach((r) => {
        //   responseData.push(...r); // push them to the main array
        // });
        responseData = res.flat(); // push contents of res to the main array

        await redisClient.setEx(
          "coin_markets_usd",
          1800,
          JSON.stringify(responseData)
        );
      }
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
      let cachedData = await redisClient.get("coins_list_id_map");
      let responseData = {};
      if (cachedData) {
        responseData = JSON.parse(cachedData);
      } else {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/list`);
        responseData = response.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
        }));
        await redisClient.setEx(
          "coins_list_id_map",
          84600,
          JSON.stringify(responseData)
        );
      }
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
   * @returns {Object[]} - Array of objects containing { id, name, market_cap_rank, market_cap } for each trending coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getTrending(req, res) {
    try {
      let cachedData = await redisClient.get("trending_coins");
      let responseData = {};
      if (cachedData) {
        responseData = JSON.parse(cachedData);
      } else {
        const response = await axios.get(
          `${COINGECKO_BASE_URL}/search/trending`
        );
        responseData = response.data.coins.map((coin) => ({
          id: coin.item.id,
          thumb: coin.item.small,
          name: coin.item.name,
          symbol: coin.item.symbol,
          market_cap_rank: coin.item.market_cap_rank,
          total_volume: coin.item.data.total_volume,
          market_cap: coin.item.data.market_cap,
          sparkline: coin.item.data.sparkline,
        }));
        responseData.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        await redisClient.setEx(
          "trending_coins",
          7200,
          JSON.stringify(responseData)
        );
      }
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
   * @returns {Object[]} - Array of objects containing { x: string, y: number } for the given coin
   * @throws {Error} - If the request to CoinGecko fails
   */
  async getCoinChartsInfo(req, res) {
    const { id } = req.params;
    const { daysBefore } = req.query;
    try {
      let cachedData = await redisClient.get(`coin_${id}_chart_${daysBefore}`);
      let responseData = {};
      if (cachedData) {
        responseData = JSON.parse(cachedData);
      } else {
        const response = await axios.get(
          `${COINGECKO_BASE_URL}/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: daysBefore,
              interval: "daily",
              precision: 4,
            },
          }
        );
        // take the response data and convert it into an array of objects with
        // x being a string representation of the date in the format "YYYY-MM-DD HH:MM:SS"
        // and y being the price at that time
        responseData = response.data.prices.map(([timestamp, price]) => {
          const date = new Date(timestamp);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
          return { x: formattedDate, y: price };
        });
        await redisClient.setEx(
          `coin_market_chart_${id}_${daysBefore}`,
          84600,
          JSON.stringify(responseData)
        );
      }
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

module.exports = new ApiController();
