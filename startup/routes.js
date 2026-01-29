const express = require("express");
const cors = require("cors");

// routes import
const auth = require("../app/auth/routes");

const allRoutes = (app) => {
  app.use("/upload", express.static("upload"));
  app.use(express.json());
  app.use(cors());
  app.get("/", (req, res) => {
    res.send("Backend is running");
  });
  app.get("/health", (req, res) => {
    res.send("Everything is running smoothly");
  });
  app.use("/api/auth", auth);
};

module.exports = allRoutes;
