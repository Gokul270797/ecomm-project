const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/my-app", {
            useNewUrlParser: true
        });
        console.log("MongoDB Connected");
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDb;