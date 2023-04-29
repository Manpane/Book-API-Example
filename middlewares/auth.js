express = require("express")
bcrypt = require("bcrypt")
jwt = require("jsonwebtoken")

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

module.exports.check_permission = check_permission;
module.exports.validateToken = validateToken;
