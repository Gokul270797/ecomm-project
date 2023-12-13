const express = require("express");

const router = express.Router();
const {
    loginUser,
    newUsers,
    getUsers,
    updateUser
  } = require("../controller/userController");

const { validToken, authorizeRoles } = require("../middleware/auth");

router.route("/user/login").post(loginUser);

router.route("/user/register").post(newUsers);
router.route("/user/update").post(validToken, updateUser);
router.route("/user/all").get(validToken, authorizeRoles('admin'), getUsers);

module.exports = router;
