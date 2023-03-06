const jwt = require('jsonwebtoken');
const User = require("../models/registerModel");


const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({_id: verifyUser._id});
 
        req.token = token;
        req.user = user;

        t=1;
        next();
    }
    catch(e){
        t=0;
        next();
    }
}

module.exports = auth;