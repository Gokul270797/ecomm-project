const express = require('express');
const router = express.Router();

const {
    featuredProducts,
    searchProducts,
    getAllProducts,
    newProducts
  } = require("../controller/productController");

const { validToken, authorizeRoles } = require("../middleware/auth");

router.route("/feature-product").get(featuredProducts);

router.route("/search").post(searchProducts);

router.route("/all-products").get(getAllProducts);

router.route("/add-products").post(validToken, authorizeRoles('user'), newProducts);

module.exports = router;
