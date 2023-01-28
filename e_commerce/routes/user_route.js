const express = require('express');
const user_route = express();
const path = require('path');
const hbs = require('hbs');
const staticPath = path.join(__dirname, "../public");

user_route.use(express.static(staticPath));

user_route.set("view engine", "hbs");
user_route.set('views', path.join(__dirname, '../views/user'));
hbs.registerPartials(path.join(__dirname, "../views/partials"));

const user_controller = require("../controllers/user_controller"); 
user_route.get('/', user_controller.loadHome);

module.exports = user_route;

