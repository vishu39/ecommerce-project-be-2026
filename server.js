const express = require("express");
const dotenv = require("dotenv");
const allRoutes = require("./startup/routes");
const db = require("./startup/db");
const app = express();
dotenv.config({ path: `./env/.env.${process.env.NODE_ENV || 'production'}` });

db()
allRoutes(app)


app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});