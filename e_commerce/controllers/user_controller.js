const Oil = require("../src/models/add_items");
const User = require("../src/models/user_cart");
var total = 0;
var count = 0;

function calculateTotal()
{
    User.find({}, function(err, data)
    {
        if(err){
            console.log('error while loading data', err);
            return;
        }
        else{
            total = 0;
            count = 0;
            for(var i of data)
            {
                count += 1;
                if(i.sale_price != null)
                {
                    total = total + i.sale_price*i.quantity;
                }
                else
                {
                    total = total + i.price*i.quantity;
                }
            }
        }
    })
}

const loadHome = (req, res) => {
    calculateTotal();

    Oil.find({}, function(err, data){
        if(err){
            console.log('error while loading data', err);
            return;
        }
        else{
            User.find({}, function(err, user_data){
                if(err){
                    console.log('error while loading data', err);
                    return;
                } 
                else{ 
                    return res.render('home', {Oil_List: data, Cart_List: user_data, total: total, count: count});
                }
            })
            // return res.render('home', {Oil_List: data, Cart_List: cartList});
        }
    })

};

const loginLoad = async(req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log("error while loading login: ",error.message);
    }
};

const verifyLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password; 

        // checking if user exists and verified or not
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
                    req.session.user_id = userData._id;
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

    } catch (error) {
        console.log("error while verifying login: ", error.message);
    }
};

const addToCart = async(req, res) => {
    try{
        const cartData = new User({
            id: req.body.id,
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            sale_price: req.body.sale_price, 
            quantity: req.body.quantity
        })

        const data = await cartData.save();  
        
        return res.redirect('back');
    } 
    catch(e){
        console.log(e);
        res.send(e);
    }
}

const deleteProduct = async(req, res) => {
    try{
        const id = req.body.id;

        const data = await User.deleteOne({_id:id});  
        
        return res.redirect('back');
    } 
    catch(e){
        console.log(e);
        res.send(e);
    }
}

const editQuantity = async(req, res) => {
    try{
        const id = req.body.id;
        const minus = req.body.minus;
        console.log(minus);
        const plus = req.body.plus;
        console.log(plus);
        if(minus == "-"){
            const data = await User.updateOne({_id:id},{
                $inc : {
                    quantity: -1
                }
            });
        }
        if(plus == "+"){
            const data = await User.updateOne({_id:id},{
                $inc : {
                    'quantity' : 1
                }
            });
        }
        
        return res.redirect('back');
    } 
    catch(e){
        console.log(e);
        res.send(e);
    }
}

module.exports = {loadHome, loginLoad, verifyLogin, addToCart, deleteProduct, editQuantity};