const Oil = require("../src/models/add_items");

const getUpload = (req, res) => {
    res.render('upload');
}

const addItems = async(req, res) => {
    try{
        const oilData = new Oil({
            name: req.body.name,
            image: req.file.filename,
            price: req.body.price,
            sale_price: req.body.sale_price
        })

        const data = await oilData.save();  
        
        return res.render('upload');
    } 
    catch(e){
        res.send(e);
    }
};

module.exports = {
    getUpload,
    addItems
}
