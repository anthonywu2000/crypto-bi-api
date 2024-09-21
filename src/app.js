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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}.`));