const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://localhost:27017/essential_oils",{
    useNewUrlParser: true
}).then(() => {
    console.log("Connection Succesful");
}).catch((e) => {
    console.log("No Connection ", e);
})