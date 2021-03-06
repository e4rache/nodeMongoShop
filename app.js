const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users.js");

const app = express();

// db connection
const MONGO_ATLAS_PASSWORD = "e4rache";

mongoose.connect(
  "mongodb+srv://e4rache:" +
    MONGO_ATLAS_PASSWORD +
    "@cluster0-aun2c.mongodb.net/test?retryWrites=false",
  { useNewUrlParser: true }
);

// mongoose.Promise = global.Promise

// middlewares

app.use(morgan("dev")); // logging

app.use("/images", express.static("images"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    // It doesn't need to continue to the routes
    // if the method was OPTIONS
    return res.status(200).json({});
  }
  next();
});

// routes

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

// error handling

app.use((req, res, next) => {
  const error = new Error("route not implemented");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
