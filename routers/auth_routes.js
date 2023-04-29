express = require("express")
bcrypt = require("bcrypt")
jwt = require("jsonwebtoken")

const router = express.Router()
const User = require("../model/user")

router.post("/signup",async (req,res) => {
    const {email,password,role} = req.body
    try {
        // checking if the email already exists
        let user = await User.findOne({email:email})
        if (user){
            return res.status(401).json({"error_message":"Cannot create two user with same email."})
        }

        // checking if the role is admin for the new user because only one admin account can be created
        if (role.toLowerCase()=="admin"){
            user = await User.findOne({role:"admin"})
            if (user){
                return res.status(401).json({"error_message":"Admin already exists"})
            }
        }

        // Now hasing the password with bcrypt
        const hash = await bcrypt.hash(password,10)
        const new_user = await new User({email:email,password:hash,role:role}).save();
        return res.status(200).json({account:new_user})
        //generating access token
        
    } catch (error) {
        return res.status(500).json({"error_message":error.message})
    }

})

router.post("/login",async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({"error_message":"No user with "+email+" is registered. "});
    }
    
    if(await bcrypt.compare(password,user.password)){
        const tokenData = {
            email: user.email,
            role: user.role,
            expire_date: Date.now() + (2*86400000) // 2 days
        }
        const token = jwt.sign(tokenData,process.env.ACCESS_KEY)
        return res.status(200).json({user:user,"token":token})
    }
    return res.status(402).json({"error_message":"Invalid credentials"})
})
module.exports = router;