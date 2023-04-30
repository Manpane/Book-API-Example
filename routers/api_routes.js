express = require("express")
const router = express.Router()
const Book = require("../model/book")

const {validateToken, check_permission, check_block_status } = require("../middlewares/auth")

router.get("/", validateToken , async (req,res)=>{ // get all the books
    try{
        user_email = req.tokenData.email
        let data = await Book.find();
        data = data.filter(book=>!book.blocked_to.includes(user_email)) // filtering out the blocked books for this user
        return res.status(200).json(data);
    }catch(error){
        return res.json({"error_message":error.message})
    }
})

router.get("/:isbn", validateToken ,check_block_status , async (req,res)=>{ // get book by ISBN number
    try{
        const data = await Book.find({ISBN:req.params.isbn});
        return res.status(200).json(data);
    }catch(error){
        return res.json({"error_message":error.message})
    }
})

router.post("/", validateToken , check_permission(["librarian","admin"]) , async (req,res)=>{ // create new book
    try{
        const data = new Book(req.body.book);
        return res.json(await data.save())
    }catch(error){
        return res.json({"error_message":error.message})
    }
})

router.patch("/:isbn", validateToken, check_permission(["librarian","admin"]), async (req,res)=>{ // update book by ISBN number
    try{
        console.log("Check");
        const updated = await Book.updateOne({ISBN:req.params.isbn},req.body.book)
        return res.status(200).json(updated);    
    }catch(err){
        return res.json({"error_message":err.message})
    }
})

router.delete("/:isbn", validateToken, check_permission(["admin"]) , async (req,res)=>{ // delete book by ISBN number
    try{
        console.log(req.params)
        const deleted = await Book.findOneAndDelete({ISBN:req.params.isbn})
        return res.status(202).json(deleted)
    }catch(err){
        return res.json({"error_message":err.message})
    }
})

module.exports = router;