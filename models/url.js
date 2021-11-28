const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  urlCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Url", urlSchema);
