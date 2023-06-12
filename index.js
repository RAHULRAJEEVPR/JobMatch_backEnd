const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
let cors = require("cors");
const cookieParser=require("cookie-parser")

//database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connition sucessfull");
  })
  .catch((err) => {
    console.log(err);
  });

  //middlewares
 app.use(express.urlencoded({extended:true}))
 











//port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port${port}`);
});
