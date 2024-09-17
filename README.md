## Cryptocurrency Market API Service

- These are the endpoints for the centralized cryptocurrency dashboard, utilizing CoinGecko API.
# TODOs: 
   - Add Redis for caching data that are from the APIs, this reduces the number of API calls. For simplicity, might need to limit the time the data stays in Redis.
   - API specification details need to be written.
   - Consider paging for /coin-markets endpoints.
   - E2E testing on the endpoints.