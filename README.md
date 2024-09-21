## Cryptocurrency Market API Service

A RESTful API service providing the most up-to-date cryptocurrency information for the top 250 cryptocurrency by market capitalization value. This service is
utilizes the CoinGecko API platform.

The intention of creating this service is to provide the information for a currently in-progress frontend dashboard (BI) application, which displays the cryptocurrency information
into tables and charts.

Tech stacks used in this service includes the Node.js framework Express.js, Redis for caching API responses, Docker for creating an instance of the database, and axios for fetching
data from the CoinGecko endpoints.

## TODOs: 
   - Unit tests on the API endpoints.
   - Creating endpoint middleware.