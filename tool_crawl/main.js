const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 8080;
const { connectMongoDb } = require("./config/database");
const crawlRoute = require("./routes/crawlRoute");
const authRoute = require("./routes/authRoute");
const validateRoute = require("./routes/validateRoute");
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

// route
app.use("/api/v1/post", crawlRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/validate", validateRoute);
app.use("/api/v1/post", postRoute);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is working on port: ${port}`);
  connectMongoDb();
});
