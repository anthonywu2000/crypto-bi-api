const redis = require("redis");

// create a new redis client
const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1', // the host of the redis server
        port: 6379 // the port of the redis server
    }
});

// handle any errors that occur in the redis connection
redisClient.on("error", (error) => {
    console.error("Error in Redis Connection: ", error);
})

// handle the connection event
redisClient.on("connect", () => {
    console.log("Redis Connected Successfully");
});

// attempt to connect to the redis server
(async () => {
    await redisClient.connect(); // Ensure client is connected before exporting
})();

module.exports = redisClient;