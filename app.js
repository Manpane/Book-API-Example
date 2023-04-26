dotenv = require("dotenv");
express = require("express");
mongoose = require("mongoose");

dotenv.config()

database_url = process.env.DATABASE || "mongodb://localhost/books"
server_port = process.env.SERVER_PORT || 3000;

const server = express();
mongoose.connect(database_url);

const database = mongoose.connection
server.listen(server_port,()=>{console.log("Server started at ",server_port)})

database.once("open",()=>{console.log("Connected to mongodb server.")})

server.use(express.json())
server.use("/api",require("./routers/routes"))
