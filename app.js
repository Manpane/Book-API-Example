const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

dotenv.config()

database_url = process.env.DATABASE || "mongodb://localhost/library"
server_port = process.env.SERVER_PORT || 3000;

const server = express();
mongoose.connect(database_url);

const database = mongoose.connection
server.listen(server_port,()=>{console.log("Server started at ",server_port)})

database.once("open",()=>{console.log("Connected to mongodb server.")})

server.use(express.urlencoded({ extended: true }));

server.use(express.json())
server.use(cookieParser())

server.use("/admin",require("./routers/admin_routes"))
server.use("/api",require("./routers/api_routes"))
server.use("/auth",require("./routers/auth_routes"))

