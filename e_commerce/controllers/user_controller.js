const Oil = require("../src/models/add_items");
const User = require("../src/models/registerModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var total = 0;
var count = 0;


const loadHome = (req, res) => {
    Oil.find({}, async function (err, data) {
        if (err) {
            console.log('error while loading data', err);
            return;
        }
        else {
            data.sort((a,b) => b.quantity - a.quantity);
            var cart = req.session.cart;
            if(cart != undefined)
            {
                calculateTotal(cart, req);
            }
            const token = req.cookies.jwt;
            if(token!=undefined)
            {
                const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

                const user = await User.findOne({ _id: verifyUser._id });
                
                if(cart == undefined || cart.length == 0)
                {
                    if(user.is_admin == 1){
                        return res.render('home', {
                            Oil_List: data,
                            Cart_List: cart,
                            total: total,
                            count: count,
                            logout: user.name.toUpperCase(),
                            isAdmin: "Admin",
                            a: "div",
                            disabled: "disabled"
                        });
                    }
                    return res.render('home', {
                        Oil_List: data,
                        Cart_List: cart,
                        total: total,
                        count: count,
                        logout: user.name.toUpperCase(),
                        a: "div",
                        disabled: "disabled"
                    });
                }
                if(user.is_admin == 1)
                {
                    return res.render('home', {
                        Oil_List: data,
                        Cart_List: cart,
                        total: total,
                        count: count,
                        logout: user.name.toUpperCase(),
                        isAdmin: "Admin",
                        checkout: "/checkout",
                        a: "a"
                    });
                }

                return res.render('home', {
                    Oil_List: data,
                    Cart_List: cart,
                    total: total,
                    count: count,
                    logout: user.name.toUpperCase(),
                    checkout: "/checkout",
                    a: "a"
                });
            }
            if(cart == undefined || cart.length == 0)
            {
                return res.render('home', {
                    Oil_List: data,
                    Cart_List: cart,
                    total: total,
                    count: count,
                    login: "Login",
                    register: "Register",
                    a: "div",
                    disabled: "disabled"
                });
            }
            res.render('home', {
                Oil_List: data,
                Cart_List: cart,
                total: total,
                count: count,
                login: "Login",
                register: "Register",
                checkout: "/checkout",
                a: "a"
            });
        }
    })

};

const loginLoad = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if(token!=undefined)
        {
            const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

            const user = await User.findOne({ _id: verifyUser._id });

            res.redirect('/');
        }
        else{
            res.render('login');
        }
    } catch (error) {
        console.log("error while loading login: ", error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email: email});
     
        if(userData){ 
            // decrypting and verifying password
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                // checking is email verified or not
                if(userData.is_verified === 0){
                    res.render('login', {message: 'Your Email is not verified'});
                }
                else{
                    const token = await userData.generateToken(); 
                    await userData.save();
                    res.cookie("jwt", token)
                    return res.redirect('back');
                }
            }
            else{
                res.render('login', {message: 'Your Password is incorrect'});
            }
        }
        else{
            res.render('login', {message: 'Your Email or password is incorrect'});
        }
    }
    catch (e) {
        res.send(e);
    }
}

const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log("error while loading login: ", error.message);
    }
}

// for sending mail
const sendVerifyMail = async(name, email, user_id) => {
    try {
        // providing the host
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: { 
                user: "mradulv26@gmail.com",
                pass: "hggphcbenjifftgf"
            }
        });

        // providing which mail will send the mail
        const mailOptions = {
             from: "mradulv26@gmail.com",
             to: email,
             subject: "for verification mail",
             html: '<p>Hii ' +name+ ' please click here to <a href="http://localhost:5000/verify?id='+ user_id +'">Verify</a> Your mail.</p>'
        };

        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Email has been sent successfully", info.response);
            }
        });

    } catch (error) { 
        console.log("error while sending mail", error.message);
    }
};

const insertUser = async (req, res) => {
    try {
        const userData = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            is_admin: 0
        })

        const data = await userData.save();

        if(data){
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('register', {message: 'Your registration has been successfully completed, Please verify your mail'});
        }
        else{
            res.render('register', {message: 'User registration failed'});
        }
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
}

const verifyMail = async(req, res) => {
    try {
        const updatedInfo =  await User.updateOne({
            _id: req.query.id,
        },
        {
            $set: {
                is_verified: 1 
            },
        });

        res.send("Email verified successfully");

    } catch (error) {
        console.log("error while verifying mail: ",error.message);
    }
};

function isProductInCart(cart, id)
{
    for(let i=0; i<cart.length; i++)
    {
        if(cart[i].id == id)
        {
            return true;
        }
    }

    return false;
}

function calculateTotal(cart, req)
{
    total = 0;
    count = 0;
    for(let i=0; i<cart.length; i++)
    {
        count += parseInt(cart[i].quantity);
        if(cart[i].sale_price)
        {
            total += cart[i].sale_price * cart[i].quantity;
        }
        else
        {
            total += cart[i].price * cart[i].quantity;
        }
    }
    req.session.total = total;
    return total;
}

const addToCart = async (req, res) => { 
    try {
        const id = req.body.id;
        const name = req.body.name;
        const image = req.body.image;
        const price = req.body.price;
        const sale_price = req.body.sale_price;
        const quantity = req.body.quantity;
        var product = { id, name, image, price, sale_price, quantity };

        if(req.session.cart)
        {
            var cart = req.session.cart;
            var condition = isProductInCart(cart, id);
            if(condition)
            {
                for(let i=0; i<cart.length; i++)
                {
                    if(cart[i].id == id)
                    {
                        if(cart[i].quantity > 0)
                        {
                            cart[i].quantity = parseInt(cart[i].quantity)+1;
                        }
                    }
                }
            }
            else
            {
                cart.push(product);
            }
        }
        else
        {
            req.session.cart = [product];
            var cart = req.session.cart;
        }

        calculateTotal(cart, req);
        
        return res.redirect('back');

    }
    catch (e) {
        res.send(e);
    }
}

const deleteProduct = async (req, res) => { 
    try {
        const id = req.body.id;
        var cart = req.session.cart;


        for(let i=0; i<cart.length; i++)
        {
            if(cart[i].id == id)
            {
                cart.splice(i,1);
            }
        }

        calculateTotal(cart, req);

        return res.redirect('back');
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
}

const editQuantity = async (req, res) => {
    try {
        const id = req.body.id;
        const minus = req.body.minus;
        const plus = req.body.plus;
        var cart = req.session.cart; 
        if(plus)
        {
            for(let i=0; i<cart.length; i++)
            {
                if(cart[i].id == id)
                {
                    if(cart[i].quantity > 0)
                    {
                        cart[i].quantity = parseInt(cart[i].quantity)+1;
                    }
                }
            }
        }
        if(minus)
        {
            for(let i=0; i<cart.length; i++)
            {
                if(cart[i].id == id)
                {
                    if(cart[i].quantity > 1)
                    {
                        cart[i].quantity = parseInt(cart[i].quantity)-1;
                    }
                    else if(cart[i].quantity == 1)
                    {
                        cart.splice(i,1);
                    }
                }
            }
        }
        calculateTotal(cart, req);

        return res.redirect('back');
    }
    catch (e) {
        res.send(e);
    }
}

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((ele) => {
            return ele.token != req.token
        })
        res.clearCookie('jwt');
        await req.user.save();
        res.redirect('/');
    }
    catch (e) {
        res.send(e);
    }
}

const checkout = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if(token!=undefined)
        {
            const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

            const user = await User.findOne({ _id: verifyUser._id });

            var cart = req.session.cart;
            if(cart == undefined || cart.length == 0)
            {
                res.redirect('/');
            }

            if(user.is_admin == 1)
            {
                return res.render('checkout', {
                    Cart_List: cart,
                    total: total,
                    count: count,
                    userName: user.name.toUpperCase(),
                    isAdmin: "Admin",
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                });
            }
            return res.render('checkout', {
                Cart_List: cart,
                total: total,
                count: count,
                userName: user.name.toUpperCase(),
                name: user.name,
                email: user.email,
                mobile: user.mobile
            });
        }
        res.redirect('login');
        
    } catch (error) {
        console.log("error while loading login: ", error.message);
    }
}

module.exports = {
    loadHome,
    loginLoad,
    verifyLogin,
    registerLoad,
    insertUser,
    verifyMail,
    addToCart,
    deleteProduct,
    editQuantity,
    logoutUser,
    checkout
};