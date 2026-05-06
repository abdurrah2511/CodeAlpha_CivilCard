const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  description: String,
  image: String,
  color: String,
  rarity: String,
  team: String,
});

module.exports = mongoose.model("Product", productSchema);