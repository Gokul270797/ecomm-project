const express = require('express');
const router = express.Router();

const {
    featuredProducts,
    searchProducts
  } = require("../controller/productController");

router.get('/feature-product', featuredProducts);

router.post('/search', searchProducts);

module.exports = router;
