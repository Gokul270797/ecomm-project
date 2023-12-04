const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ success: false, error: 'Please enter email & password' });
    }
    const user = await User.findOne({
        $and: [{ username }],
      }).select("+password");
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
        let jwtSecretKey = '1!2@3#4$5%GGGGG'; 
        
        const token = jwt.sign({ id:user._id }, jwtSecretKey); 
      
        res.status(200).json({ success: true, token });
}

exports.newUsers = async (req, res, next) => {

    const { email, username, mobile, password } = req.body;
    try {
        if (!username || !password || !email || !mobile) {
            res.status(401).json({ success: false, error: 'All fields are mandatory' });
        }
        const existingUserName = await User.findOne({ username: username }).select(
        "+password"
        );
        if (existingUserName) {
            res.status(401).json({ success: false, error: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email: email }).select(
            "+password"
        );

        if (existingEmail) {
            res.status(401).json({ success: false, error: 'Email already exists' });
        }
    
        const user = await User.create({
            email,
            username,
            password,
            mobile,
        });
    
        res.status(200).json({
        success: true,
        message: "Added Successfully",
        user,
        });
    } catch (error) {   
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
