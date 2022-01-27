const express = require("express");
const app = express();
const connectDB = require("./db");
require("dotenv").config();

const PORT = process.env.BOOK_PORT || 8080;
// connecting databse
connectDB();

// using uploads folder to store the csv files being uploaded
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("Book sample service response");
});

app.use("/api/v1/books", require("./routes/book"));

app.listen(PORT, () => {
    console.log(`Book Service Server is running at ${PORT}`);
});
