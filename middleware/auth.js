const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('./catchAsyncError')

exports.validToken = catchAsyncError( async (req, res, next) => {
    const token = req.header('Authorization');
    //console.log("token", token);
    if(!token){
        return next(new ErrorHandler('Login first to access this resource', 401))
    }
    let jwtSecretKey = '1!2@3#4$5%GGGGG'; 
    const verified = jwt.verify(token, jwtSecretKey); 
    if(verified){ 
        req.user =  await User.findById( verified.id );
        next() 
    }else{ 
        return res.status(401).send('Access Denied'); 
    } 
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        //console.log(roles+" | "+req.user.role);
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler('You\'re not allowed to access this page', 403));
        }
        next();
    }
}