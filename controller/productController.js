const Product = require('../models/Product');

exports.featuredProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true });

        res.json(featuredProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchProducts = async (req, res) => {
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
    
        res.json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};