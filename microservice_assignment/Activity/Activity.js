const express = require("express");
const app = express();
const connectDB = require("./db");
require("dotenv").config();

const PORT = process.env.ACTIVITY_PORT || 8000;
// connecting databse
connectDB();

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("ACTIVITY service server response");
});

app.use("/api/v1/activity", require("./routes/activity"));

app.listen(PORT, () => {
    console.log(`Activity Service Server is running at ${PORT}`);
});
