//MongoDB Connection

require("dotenv").config();
exports.connect = () => {
  try {
    const mangoose = require("mongoose");
    mangoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yj2ao.mongodb.net/url-shortner?retryWrites=true&w=majority`,

      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    mangoose.connection
      .once("open", () => {
        console.log("connected to Database");
      })
      .on("error", (error) => {
        console.log("Your Error", error);
      });
  } catch (error) {
    console.log(error);
    console.log("error in connecting db");
    process.exit();
  }
};
