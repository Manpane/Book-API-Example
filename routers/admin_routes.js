const express = require("express")
const router = express.Router()
const Book = require("../model/book")

const {validateToken, check_permission } = require("../middlewares/auth")
const { response } = require("express")

const {block_user} = require("../utils/admin_utils")

router.post("/block",validateToken,check_permission(["admin"]), async (req,res)=>{
    try {
        let user_to_block = req.body.email // contains user's email to block
        let books_to_block = req.body.books // contains ISBN numbers of the books to block
        return res.status(200).json(await block_user(user_to_block,books_to_block))
    } catch (error) {
        return res.status(500).json({"error_message":error.message})
    }
})

router.post("/unblock",validateToken,check_permission(["admin"]), async (req,res)=>{
    try {
        let user_to_unblock = req.body.email // contains user's email to block
        let books_to_unblock = req.body.books // contains ISBN numbers of the books to block
        return res.status(200).json(block_user(user_to_unblock,books_to_unblock,unlock=true)) // unblock parameter unblocks instead of blocking
    } catch (error) {
        return res.status(500).json({"error_message":error.message})
    }
})


module.exports = router;



