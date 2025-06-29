const express = require("express");
const {
  loginController,
  registerController,
} = require("../controllers/userController");

const router = express.Router();

//Login Route
router.post("/login", loginController);

//Register Route
router.post("/register", registerController);

module.exports = router;
