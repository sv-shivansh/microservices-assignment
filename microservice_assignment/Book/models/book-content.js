const mongoose = require("mongoose");

const bookContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    story: {
        type: String,
        required: true,
    },
    reads: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        },
    ],
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        },
    ],
    publishedOn: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});

module.exports = bookContent = mongoose.model(
    "book_content",
    bookContentSchema
);
