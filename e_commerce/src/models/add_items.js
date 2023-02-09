const mongoose = require('mongoose');

const oilSchema = new mongoose.Schema({
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
    }
})

const Oil = new mongoose.model("Oil", oilSchema);

module.exports = Oil;