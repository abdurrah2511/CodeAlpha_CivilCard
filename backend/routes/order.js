const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATING ORDER
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    const order = new Order({
      userId,
      items,
      totalAmount
    });

    await order.save();

    res.json({ message: "Order saved", order });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GETTING USER ORDER
router.get("/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = new Order({
      userId: req.user.id, // from token
      items,
      totalAmount
    });

    await order.save();

    res.json({ message: "Order saved", order });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;