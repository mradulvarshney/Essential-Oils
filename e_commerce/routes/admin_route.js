const express = require('express');
const admin_route = express();
const hbs = require('hbs');
const path = require('path');
const staticPath = path.join(__dirname, "../public");

admin_route.use(express.static(staticPath));

admin_route.set('view engine', 'hbs');
admin_route.set('views', path.join(__dirname, "../views/admin"));
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

const admin_controller = require('../controllers/admin_controller');
admin_route.get('/upload', admin_controller.getUpload);
admin_route.post('/upload', upload, admin_controller.addItems);

module.exports = admin_route;