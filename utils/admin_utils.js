
const Book = require("../model/book")

async function block_user(email,books,unblock=false){
    let response = {}
    for (const ISBN of books) {
        try {
            const book = await Book.findOne({ISBN});
            if(book){
                if (!unblock){
                    if (book.blocked_to.includes(email)){
                        response[ISBN] = "Already blocked"
                    }else{
                        book.blocked_to.push(email);
                        const updated = Book.updateOne({ISBN},book);
                        response[ISBN]=book
                    }
                }else{
                    if (book.blocked_to.includes(email)){
                        book.blocked_to = book.blocked_to.filter(user_emails=>user_emails!=email)
                        const updated = Book.updateOne({ISBN},book);
                        response[ISBN]=book
                    }else{
                        response[ISBN]="Not blocked"
                    }
                }
            }else{
                response[ISBN] = "Couldn't find book."
            }
        } catch (error) {
            response[ISBN] = "Server error"
        }
    }
}

module.exports = {block_user};
