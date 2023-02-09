const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    sale_price: {
        type: Number,
    },
    quantity: {
        type: Number
    }
})

const User = new mongoose.model("User", cartSchema);

module.exports = User;