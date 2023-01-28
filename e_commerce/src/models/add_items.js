const mongoose = require('mongoose');

const oilSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

const Oil = new mongoose.model("Oil", oilSchema);

module.exports = Oil;