const express = require("express");

const router = express.Router();

const {
    loginUser,
    newUsers
  } = require("../controller/userController");

const { validToken } = require("../middleware/auth");

router.route("/user/login").post(loginUser);

router.route("/user/register").post(newUsers);

module.exports = router;
