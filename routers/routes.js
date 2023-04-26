express = require("express")

const router = express.Router()
const Book = require("../model/book")

router.get("/", async (req,res)=>{ // get all the books
    try{
        const data = await Book.find();
        res.status(200).json(data);
    }catch(error){
        res.json({"error_message":error.message})
    }
})

router.get("/:isbn", async (req,res)=>{ // get book by ISBN number
    try{
        const data = await Book.find({ISBN:req.params.isbn});
        res.status(200).json(data);
    }catch(error){
        res.json({"error_message":error.message})
    }
})


router.post("/", async (req,res)=>{ // create new book
    try{
        const data = new Book(req.body);
        res.json(await data.save())
    }catch(error){
        res.json({"error_message":error.message})
    }
})

router.patch("/:isbn", async (req,res)=>{ // update book by ISBN number
    try{
        Book.updateOne({ISBN:req.params.isbn},req.body)
    }catch(err){
        res.json({"error_message":err.message})
    }
    res.status(200).json(data);
})


router.delete("/:isbn", async (req,res)=>{ // delete book by ISBN number
    try{
        const deleted = Book.findOneAndDelete({ISBN:req.params.isbn})
        res.json(deleted)
    }catch(err){
        res.json({"error_message":err.message})
    }
})

module.exports = router;