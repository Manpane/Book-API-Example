express = require("express")
bcrypt = require("bcrypt")
jwt = require("jsonwebtoken")
const Book = require("../model/book")

async function check_block_status(req,res,next){
    const ISBN = req.params.isbn
    const book = await Book.findOne({ISBN})
    if (book){
        if(book.blocked_to.includes(req.tokenData.email)){
            return res.status(403).json({"error_message":"You don't have the permission to access this book."})
        }
    }
    next()
}

function check_permission(roles_to_permit){
    return function (req,res,next){ // returning a middleware function
        const permit = roles_to_permit.includes(req.tokenData.role);
        if (!permit){
            return res.status(403).json({"error_message":"Not allowed"})
        }
        next()
    }
}

function validateToken(req,res,next){
    token = req.cookies["token"] || req.body.token
    if(token){
        jwt.verify(token,process.env.ACCESS_KEY, (error, data)=>{
            if (error){
                req.clearCookie("token")
                return res.status(401).json({"error_message":"Token invalid"})
            }
            req.tokenData = data
            next()
        })
    }else{
        return res.status(401).json({"error_message":"No token provided"})
    }
}

module.exports = {check_block_status,check_permission,validateToken}
