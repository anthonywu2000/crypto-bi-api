const axios = require("axios");

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

class ApiController {
  constructor() {}

  // TODO: get coin markets, only usd allowed, getting the first top 250 market cap coins
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

  // TODO: get the list of coins and their ids
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

  // TODO: get the trending searches for crypto (CoinGecko only provides the top 15 popular user searches)
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

  // TODO: get the charts data
  // parameters: user input duration (ie. past 1 day, past 10 days...) and id (coin id) (app dev will display the corresponding coin name not the id)
  async getCoinChartsInfo(req, res) {
    
  }
}

module.exports = new ApiController();
