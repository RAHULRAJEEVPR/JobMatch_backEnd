const express = require("express");
const app = express();
require("dotenv").config();
let cors = require("cors");
const dbConfig=require("./config/dbConfig")
//const cookieParser=require("cookie-parser")
const server = require('http').createServer(app)
const {configureSocket} = require('./config/socket')


const userRoute=require("./routes/userRoutes")
const empRouter=require("./routes/employerRoutes")
const adminRouter=require("./routes/adminRouter")

//socket setup
configureSocket(server)

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(cors({ 
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}))
app.use("/user",userRoute)
app.use("/employer",empRouter)
app.use("/admin",adminRouter)


//port
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port${port}`);
});
