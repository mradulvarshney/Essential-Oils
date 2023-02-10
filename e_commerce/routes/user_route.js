const express = require('express');
const user_route = express();
const path = require('path');
const hbs = require('hbs');
const staticPath = path.join(__dirname, "../public");

user_route.use(express.static(staticPath));

user_route.set("view engine", "hbs");
user_route.set('views', path.join(__dirname, '../views/user'));
hbs.registerPartials(path.join(__dirname, "../views/partials"));

const multer = require('multer');
const storage = multer.diskStorage({
    // file uploading destination
    destination: function(req, file, cb){
        // call back function
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req, file, cb){
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name);
    }
});

const upload = multer({storage: storage}).single('file');

const user_controller = require("../controllers/user_controller"); 

user_route.get('/', user_controller.loadHome);

user_route.get('/login', user_controller.loginLoad);

// getting the user data from form
user_route.post('/login', user_controller.verifyLogin);

user_route.post('/add_to_cart', upload, user_controller.addToCart);

user_route.post('/delete_product', user_controller.deleteProduct);

user_route.post('/edit_quantity', user_controller.editQuantity);

module.exports = user_route;

