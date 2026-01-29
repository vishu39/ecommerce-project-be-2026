const mongoose = require("mongoose");

module.exports = function db() {
  mongoose
    .connect(process.env.DB)
    .then(() => console.log("DB Connected Successfully..."))
    .catch((err) => console.log("Error to connect", err));
};
