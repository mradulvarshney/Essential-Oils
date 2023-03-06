// creating schema for user
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    is_admin:{
        type: Number,
        required: true
    },
    is_verified:{
        type: Number,
        default: 0
    },
    tokens : [{
        token : {
            type: String,
            required : true
        }
    }]
});


//genrating tokens
userSchema.methods.generateToken = async function()
{
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        return token;
    }
    catch(error){
        res.send(console.error());
    }
}

//bcrypt the password
userSchema.pre("save", async function(next) {
    if(this.isModified("password"))
    { 
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = new mongoose.model("User", userSchema);

module.exports = User;