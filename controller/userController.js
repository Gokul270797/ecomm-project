const User = require('../models/user');
const jwt = require('jsonwebtoken');

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const APIFeature = require("../utils/apiFeature");

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

exports.newUsers = catchAsyncError(async (req, res, next) => {

    const { email, username, mobile, password, role } = req.body;
    try {
        if (!username || !password || !email || !mobile || !role) {
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
            role
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
});

exports.getUsers = catchAsyncError(async (req, res, next) => {
    const resPerPage = 10;
    const userCount = await User.countDocuments();
  
    const apiFeature = new APIFeature(
      User.find()
        .sort({ _id: -1 })
        .select("+password"),
      req.query
    )
      .search()
      .filter()
      .pagination(resPerPage);
    const users = await apiFeature.query;
  
    //console.log(req.ip);
  
    res.status(200).json({
      success: true,
      count: users.length,
      userCount,
      users,
    });
  });

  exports.updateUser = catchAsyncError(async (req, res, next) => {
    const updatedBy = req.user.id;
    //console.log(req.body.permission);
    //updateBy = '6172a635c4ae1736a2d3df83';
    const id = req.body.userId;
    //console.log(updateBy);
    //const {name, username, mobile, password, role, createdBy, id} = req.body;
    const existingUser = await User.findById(id).select("+password");
  
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  
    const userFields = {};
    
    userFields.username = req.body.username;
    userFields.mobile = req.body.mobile;
    userFields.role = req.body.role;
    userFields.email = req.body.email;
    userFields.updatedBy = updatedBy;

    if (req.body.passwordUpdate) {
        userFields.password = await bcrypt.hash(req.body.passwordUpdate, 10);
    }
    
  
    const user = await User.findByIdAndUpdate(id, userFields, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(201).json({
      success: true,
      message: "Updated Successfully",
      user,
    });
});
