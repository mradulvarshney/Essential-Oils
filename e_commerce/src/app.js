const port = 5000;
const path = require('path');
const express = require('express');
const app = express();
require('./db/connections');


// for user routes
const userRoute = require('../routes/user_route');
app.use('/', userRoute);

// for admin routes
const adminRoute = require('../routes/admin_route');
app.use('/admin', adminRoute);


app.listen(port, (error) => {
    if(error){
        console.log("Error");
        return;
    }
    console.log(`Listening to post ${port}`);
})