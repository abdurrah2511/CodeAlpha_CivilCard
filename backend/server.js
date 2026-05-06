require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const path = require("path");
const orderRoutes = require("./routes/order");

const app = express();

// MIDDLEWARE
app.use(cors({origin:'*', methods:["GET","POST", "PUT", "DELETE"]}));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("the Civil Card is running, hehe");
});

// DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected for the time"))
.catch(err => console.log(err));

// SERVER START
app.listen(5000, () => console.log("Server running , yep it is"));

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/defaults", express.static(path.join(__dirname,"defaults")));

app.use("/api/orders", orderRoutes);