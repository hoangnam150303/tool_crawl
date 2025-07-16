const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 8080;
const { connectMongoDb } = require("./config/database");
const postRoute = require("./routes/postRoute");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL, // accept requests from this origin
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/post", postRoute);
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
  connectMongoDb();
});
