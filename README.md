## Cryptocurrency Market API Service

- These are the endpoints for the centralized cryptocurrency dashboard, utilizing CoinGecko API.
## TODOs: 
   - Add Redis for caching data that are from the APIs, this reduces the number of API calls. Set data cached for 24 hours.
   - Change UNIX time to Chat.js readable date format.
   - Consider paging for /coin-markets endpoints.
   - Unit tests on the endpoints.