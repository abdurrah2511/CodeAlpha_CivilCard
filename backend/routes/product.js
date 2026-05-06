const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GETTING ALL PRODUCT
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GETTING SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// ADDING PRODUCT, TEST
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

module.exports = router;