const express = require("express");
const dotenv = require("dotenv");
const allRoutes = require("./startup/routes");

const app = express();
dotenv.config({ path: `./env/.env.${process.env.NODE_ENV || 'production'}` });
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Current PORT: ${process.env.PORT}`);

allRoutes(app)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});