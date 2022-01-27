const router = require("express").Router();
const bookContent = require("../models/book-content");
const middleware = require("../auth");

// @access Private
// @route PUT api/v1/books/like/:id
// @desc Like a particular book entry
router.put("/like/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    try {
        let book = await bookContent.findOne({ _id: id });
        if (!book) {
            return res.status(400).json({ errors: [{ msg: "No user exist" }] });
        }
        if (
            book.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "Book already liked" });
        }
        book.likes.unshift({ user: req.user.id });
        await book.save();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
    return res.status(200).send("Book has been Liked");
});

// @access Private
// @route PUT api/v1/books/read/:id
// @desc Like a particular book
router.put("/read/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    try {
        let book = await bookContent.findOne({ _id: id });
        if (!book) {
            return res.status(400).json({ errors: [{ msg: "No user exist" }] });
        }
        if (
            book.reads.filter((read) => read.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "Book already Read" });
        }
        book.reads.unshift({ user: req.user.id });
        await book.save();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
    return res.status(200).send("Book has been Read");
});

module.exports = router;
