const User = require("./models/user-model");
module.exports = async function (req, res, next) {
    const user = req.header("user");
    if (!user) {
        return res.status(401).json({ msg: "No User Found" });
    }
    try {
        const data = await User.findOne({ _id: user });
        req.user = data;
        next();
    } catch (err) {
        res.status(401).json({ msg: "User Id not valid" });
    }
};
