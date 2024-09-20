const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./routes/api.js");
const redisClient = require('./redisClient');

const app = express();
app.use(express.json());
app.use(cors()); // TODO: define corsOptions for the application dev
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// global route path
app.use("/api/v1", apiRouter);


// create a new redis client
// const redisClient = redis.createClient({
//     socket: {
//         host: '127.0.0.1', // the host of the redis server
//         port: 6379 // the port of the redis server
//     }
// });

// // handle any errors that occur in the redis connection
// redisClient.on("error", (error) => {
//     console.error("Error in Redis Connection: ", error);
// })

// // handle the connection event
// redisClient.on("connect", () => {
//     console.log("Redis Connected Successfully");
// });

// // attempt to connect to the redis server
// redisClient.connect().catch(console.error);

// module.exports = redisClient;

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}.`));

