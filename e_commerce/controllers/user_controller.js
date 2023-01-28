const Oil = require("../src/models/add_items");

const loadHome = (req, res) => {
    Oil.find({}, function(err, data){
        if(err){
            console.log('error while loading data', err);
            return;
        }
        else{
            return res.render('home', {Oil_List: data});
        }
    })
};

module.exports = {loadHome};