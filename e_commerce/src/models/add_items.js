const mongoose = require('mongoose');

const oilSchema = new mongoose.Schema({ 
    code: {
        type: String,
        unique: true
    },
    name:{
        type: String
    },
    botname:{
        type: String
    },
    size: {
        type: Number
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    sale_price: {
        type: Number,
    },
    discount: {
        type: Number
    },
    image:{
        type: String
    }
})

const Oil = new mongoose.model("Oil", oilSchema);

module.exports = Oil;