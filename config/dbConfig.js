const mongoose = require("mongoose");
require("dotenv").config();


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connition sucessfull");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports=mongoose