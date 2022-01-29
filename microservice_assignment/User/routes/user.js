const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user-model");
const middleware = require("../auth");

// @access Public
// @route GET api/v1/users
// @desc Fetch list of all the Users
router.get("/", async (req, res) => {
    try {
        const data = await User.find().select("-phone");
        return res.status(200).send(data);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    }
});

// @access Public
// @route POST api/v1/users
// @desc Create a new Users
router.post(
    "/",
    [
        check("first_name", "First Name is required").not().isEmpty(),
        check("last_name", "Last Name is required").not().isEmpty(),
        check("phone", "Phone no. is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { first_name, last_name, email, phone } = req.body;
        try {
            // if user exists
            let user = await User.findOne({ phone });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }
            user = new User({
                first_name,
                last_name,
                email,
                phone,
            });
            await user.save();
            return res.status(200).send(user);
        } catch (err) {
            console.error(err.message + "\n" + err);
            return res.status(500).send("Server error");
        }
    }
);

// @access Private
// @route PUT api/v1/users/:id
// @desc Update an existing user
router.put("/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    try {
        let user = await User.findByIdAndUpdate({ _id: id }, data);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "No user exist" }] });
        }
        return res.status(200).send("User Updated Successfully");
    } catch (e) {
        console.error(e.message + "\n" + e);
        return res.status(500).send("Server error");
    }
});

// @access Private
// @route Delete api/v1/users/:id
// @desc Delete the existing user
router.delete("/:id", [middleware], async (req, res) => {
    let id = req.params.id;
    try {
        let user = await User.findById({ _id: id });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "No user exist" }] });
        }
        if (user._id == req.user.id) {
            await User.findByIdAndDelete({ _id: id });
        } else {
            return res.status(400).send("You can't delete this user");
        }
        return res.status(200).send("User Deleted Successfully");
    } catch (e) {
        console.error(e.message + "\n" + e);
        return res.status(500).send("Server error");
    }
});
module.exports = router;
