const express = require("express");
const cors = require("cors");

const allRoutes = (app) => {
    app.use(express.json());
    app.use(cors());
    app.get("/", (req, res) => {
        res.send("Backend is running");
    });
    app.get("/health", (req, res) => {
        res.send("Everything is running smoothly");
    });
}

module.exports = allRoutes;