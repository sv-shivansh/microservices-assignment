const book = require("../services/book");
var controllers = {
    about: (req, res) => {
        var aboutInfo = {
            name: "something",
        };
        res.json(aboutInfo);
    },
    fetchAll: async (req, res) => {
        book.find(req, res, (err, books) => {
            if (err) res.send(err);
            res.json(books);
        });
    },
    create: async (req, res) => {
        book.create(req, res, (err, books) => {
            if (err) res.send(err);
            res.json(books);
        });
    },
};

module.exports = controllers;
