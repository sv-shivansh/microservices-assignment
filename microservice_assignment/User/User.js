const express = require("express");
const app = express();
const connectDB = require("./db");
require("dotenv").config();

const PORT = process.env.USER_PORT || 3000;
// connecting databse
connectDB();

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("User sample service response");
});

app.use("/api/v1/users", require("./routes/user"));

app.listen(PORT, () => {
    console.log(`User Service Server is running at ${PORT}`);
});
