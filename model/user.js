const mongoose = require("mongoose");
user_schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("User",user_schema)