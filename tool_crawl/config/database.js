const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
const mongoose = require("mongoose");
exports.connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "tool_scrawl",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
