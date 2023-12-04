const jwt = require('jsonwebtoken');

exports.validToken = async (req, res, next) => {
    const token = req.header('Authorization');
    //console.log("token", token);
    let jwtSecretKey = '1!2@3#4$5%GGGGG'; 
    const verified = jwt.verify(token, jwtSecretKey); 
    if(verified){ 
        req.user = verified.id;
        next() 
    }else{ 
        return res.status(401).send('Access Denied'); 
    } 
}