express = require("express")
const router = express.Router()
const Book = require("../model/book")

const {validateToken, check_permission } = require("../middlewares/auth")

router.get("/", validateToken , async (req,res)=>{ // get all the books
    try{
        const data = await Book.find();
        res.status(200).json(data);
    }catch(error){
        res.json({"error_message":error.message})
    }
})

router.get("/:isbn", validateToken ,async (req,res)=>{ // get book by ISBN number
    try{
        const data = await Book.find({ISBN:req.params.isbn});
        res.status(200).json(data);
    }catch(error){
        res.json({"error_message":error.message})
    }
})


router.post("/", validateToken , check_permission(["librarian","admin"]) , async (req,res)=>{ // create new book
    try{
        const data = new Book(req.body.book);
        res.json(await data.save())
    }catch(error){
        res.json({"error_message":error.message})
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
        res.json({"error_message":err.message})
    }
})

module.exports = router;