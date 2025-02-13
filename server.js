const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const path = require("path");

//config dotenv file
dotenv.config();

//database call
connectDb();

//rest objects
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes

//user route
app.use("/api/v1/users", require("./routes/userRoute"));

//transaction route
app.use("/api/v1/transaction", require("./routes/transactionRoute"));

//static files
app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

//PORT
const PORT = process.env.PORT;

//listen
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
