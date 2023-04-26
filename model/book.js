const mongoose = require("mongoose");
book_schema = new mongoose.Schema({
    ISBN:{
        type: Number,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    release_date:{
        type:Date,
        default: Date.now
    },
    category:{
        type:String,
        default : "English"
    },
    version:{
        type:Number,
        default: 1
    }
})
module.exports = mongoose.model("Book",book_schema)