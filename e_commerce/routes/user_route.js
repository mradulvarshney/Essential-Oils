const express = require('express');
const user_route = express();
const path = require('path');
const hbs = require('hbs');
const auth = require("../src/middleware/auth")
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

user_route.get('/register', user_controller.registerLoad);

// getting the user data from form
user_route.post('/register', user_controller.insertUser);

user_route.get('/verify', user_controller.verifyMail);

user_route.post('/add_to_cart', upload, user_controller.addToCart);

user_route.post('/delete_product', user_controller.deleteProduct);

user_route.post('/edit_quantity', user_controller.editQuantity);

user_route.get('/logout', auth, user_controller.logoutUser);

user_route.get('/checkout', user_controller.checkout);


module.exports = user_route;

