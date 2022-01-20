const router = require("express").Router();
const bookContent = require("../models/book-content");
const { check, validationResult } = require("express-validator");
const middleware = require("../middleware/auth");
const csv = require("csv-parser");
const fs = require("fs");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

// @access Public
// @route GET api/v1/books
// @desc Fetch list of all the books
router.get("/", async (req, res) => {
    try {
        const data = await bookContent.find().populate("author");
        res.status(200).send(data);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Public
// @route GET api/v1/books/find/:id
// @desc Fetch a particular book by id
router.get("/find/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await bookContent.findOne({ _id: id }).populate("author");
        res.status(200).send(data);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Public
// @route GET api/v1/books/new
// @desc Fetch list of all the books in descending order of their published Date
router.get("/new", async (req, res) => {
    try {
        const data = await bookContent.find().populate("author");
        data.sort((a, b) => (a.publishedOn < b.publishedOn ? 1 : -1));
        res.status(200).send(data);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Public
// @route GET api/v1/books/top
// @desc Fetch list of all the books in descending order of User's interaction(likes+ reads)
router.get("/top", async (req, res) => {
    try {
        const data = await bookContent.find().populate("author");
        data.sort((a, b) =>
            a.likes.length + a.reads.length < b.likes.length + b.reads.length
                ? 1
                : -1
        );
        res.status(200).send(data);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Private
// @route POST api/v1/books
// @desc Creates a new book entry
router.post(
    "/",
    [
        middleware,
        [
            check("title", "Title is required").not().isEmpty(),
            check("story", "Story is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { title, story } = req.body;
            let book = new bookContent({
                title,
                story,
                author: req.user.id,
            });
            await book.save();
            res.status(200).send(book);
        } catch (e) {
            return res
                .status(500)
                .json({ errors: [{ msg: "Internal Server Error" }] });
        }
    }
);

// @access Private
// @route PUT api/v1/books/:id
// @desc Edit an existing book entry
router.put("/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    try {
        let book = await bookContent.findOne({ _id: id }).populate("author");
        if (!book) {
            return res.status(400).json({ errors: [{ msg: "No user exist" }] });
        }
        if (book.author._id != req.user.id) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "You can't update the book as you are not the author",
                    },
                ],
            });
        }
        book = await bookContent.findByIdAndUpdate({ _id: id }, data);
        return res.status(200).send("Book Updated Successfully");
    } catch (e) {
        console.error(e.message + "\n" + e);
        return res.status(500).send("Internal Server error");
    }
});

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

// @access Public
// @route POST api/v1/books
// @desc Create book entries based on the CSV uploaded
router.post("/csv-upload", upload.single("file"), function (req, res, next) {
    let results = [];
    let data = [];
    try {
        fs.createReadStream(`./uploads/${req.file.originalname}`)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", async () => {
                const len = results.length;
                for (let i = 0; i < len; i++) {
                    const book = new bookContent({
                        title: results[i].title,
                        story: results[i].story,
                    });
                    data.push(book);
                }
                bookContent.bulkSave(data);
                return res.send(data);
            });
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Private
// @route DELETE api/v1/books/:id
// @desc Delete a particular book entry
router.delete("/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    try {
        let book = await bookContent.findOne({ _id: id });
        if (!book) {
            return res.status(400).json({ errors: [{ msg: "No book exist" }] });
        }
        if (book.author._id == req.user.id) {
            await bookContent.findByIdAndDelete({ _id: id });
        } else {
            return res.status(400).send("You can't delete this book");
        }
        return res.status(200).send("Book Deleted Successfully");
    } catch (e) {
        console.error(e.message + "\n" + e);
        return res.status(500).send("Server error");
    }
});

module.exports = router;
