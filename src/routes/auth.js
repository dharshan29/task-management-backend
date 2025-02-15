const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
// const verifyToken = require("../config/jwt");

router.post("/auth/google", authController.google);


module.exports = router;
