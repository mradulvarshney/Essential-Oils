const port = 5000;
const path = require('path');
const express = require('express');
const app = express();
require('./db/connections');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const hbs = require('hbs');
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, '../views/admin'));
hbs.registerPartials(path.join(__dirname, "../views/partials"));


// for user routes
const userRoute = require('../routes/user_route');
app.use('/', userRoute);

// for admin routes
app.get('/admin', (req, res) => {
    res.render('admin');
})
const adminRoute = require('../routes/admin_route');
app.use('/admin', adminRoute);


app.listen(port, (error) => {
    if(error){
        console.log("Error");
        return;
    }
    console.log(`Listening to post ${port}`);
})