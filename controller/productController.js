const Product = require('../models/products');
const catchAsyncError = require("../middleware/catchAsyncError");
const APIFeature = require("../utils/apiFeature");

exports.featuredProducts = catchAsyncError(async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true });

        res.json(featuredProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

exports.searchProducts = catchAsyncError(async (req, res) => {
    try {
        const query = req.body.q;
    
        if (!query) {
          return res.status(400).json({ error: 'Missing search query parameter' });
        }
    
        const results = await Product.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
          ],
        });
    
        res.status(200).json({success: true,results});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resPerPage = 10;
    const productCount = await Product.countDocuments();
  
    const apiFeature = new APIFeature(
        Product.find()
        .sort({ _id: -1 }),
      req.query
    )
      .search()
      .filter()
      .pagination(resPerPage);
    const products = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      count: products.length,
      productCount,
      products,
    });
});

exports.newProducts = catchAsyncError(async (req, res, next) => {

    const { name, description, price, category, brand, stockQuantity, imageUrl, isFeatured } = req.body;
    try {
        if (!name || !description || !price || !category || !brand || !stockQuantity || !imageUrl || !isFeatured) {
            res.status(401).json({ success: false, error: 'All fields are mandatory' });
        }
        const existing = await Product.findOne({ name: name }).select(
        "+password"
        );
        if (existing) {
            res.status(401).json({ success: false, error: 'Product already exists' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            brand,
            stockQuantity,
            imageUrl,
            isFeatured,
            userId: req.user.id
        });
    
        res.status(200).json({
            success: true,
            message: "Added Successfully",
            product,
        });
    } catch (error) {   
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});