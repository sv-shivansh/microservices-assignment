const express = require("express");
const app = express();
const routes = require("./routes/routes");
const connectDB = require("./db");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
// connecting databse
connectDB();

// using uploads folder to store the csv files being uploaded
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("Server sample response");
});
routes(app);
// app.use("/api/v1/books", require("./routes/book"));
// app.use("/api/v1/users", require("./routes/user"));

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
