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
            id: user._id,
            tokenDate: Date.now()
        }
        const token = jwt.sign(tokenData,process.env.ACCESS_KEY,{expiresIn:"2d"})
        res.cookie("token",token,{httpOnly:true,expires:new Date(Date.now()+86400*1000*2)})  //86400*1000*2 miliseconds= 2 days
        return res.status(200).json({"message":"logged in successfull"})
    }
    return res.status(402).json({"error_message":"Invalid credentials"})
})
module.exports = router;