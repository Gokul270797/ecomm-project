const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    username:{
        type: String,
        required: [true, "Please enter username"],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    password:{
        type: String,
        required: [true, "Please enter password"],
        select: false,
        minlength: [6, "Password must be longer than 6 chracters"]
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    mobile:{
        type: Number,
        required: [true, "Please enter mobile number"],
        trim: true,
    },
    orders: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Order',
        },
    ],
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

//Encrypting password before saving user
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema);