const User = require("../models/user");
var book = {
    find: async (req, res, next) => {
        try {
            const data = await User.find().select("-phone");
            return res.status(200).send(data);
        } catch (e) {
            return res
                .status(500)
                .json({ errors: [{ msg: "Internal Server Error" }] });
        }
    },
    create: async (req, res, next) => {
        const { first_name, last_name, phone } = req.body;
        if (!first_name || !last_name || !phone) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req);
        res.send("yes");
    },
};

module.exports = book;
