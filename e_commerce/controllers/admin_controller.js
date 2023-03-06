const Oil = require("../src/models/add_items");
const jwt = require('jsonwebtoken');
const User = require("../src/models/registerModel");

var total = 0;
var count = 0;

function calculateTotal(cart, req) {
    total = 0;
    count = 0;
    for (let i = 0; i < cart.length; i++) {
        count += parseInt(cart[i].quantity);
        if (cart[i].sale_price) {
            total += cart[i].sale_price * cart[i].quantity;
        }
        else {
            total += cart[i].price * cart[i].quantity;
        }
    }

    req.session.total = total;
    return total;
}

const loadAdmin = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token != undefined) {
            const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

            const user = await User.findOne({ _id: verifyUser._id });
            var cart = req.session.cart;
            if (cart == undefined || cart.length == 0) {
                if (user.is_admin == 1) {
                    return res.render('admin', {
                        Cart_List: cart,
                        total: total,
                        count: count,
                        logout: user.name.toUpperCase(),
                        isAdmin: "Admin",
                        a: "div",
                        disabled: "disabled"
                    });
                }
                return res.redirect('../');
            }
            calculateTotal(cart, req);
            if (user.is_admin == 1) {
                return res.render('admin', {
                    Cart_List: cart,
                    total: total,
                    count: count,
                    logout: user.name.toUpperCase(),
                    isAdmin: "Admin",
                    a: "a",
                    checkout: "/checkout"
                });
            }
            return res.redirect('../');
        }
        else {
            return res.redirect('../login');
        }
    }
    catch (e) {
        res.send(e);
    }
};

const getUpload = async (req, res) => {
    const token = req.cookies.jwt;
    if (token == undefined) {
        return res.redirect('../login');
    }
    if (token != undefined) {
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: verifyUser._id });
        var cart = req.session.cart;
        if (cart == undefined || cart.length == 0) {
            if (user.is_admin == 1) {
                return res.render('upload', {
                    Cart_List: cart,
                    total: total,
                    count: count,
                    logout: user.name.toUpperCase(),
                    isAdmin: "Admin",
                    a: "div",
                    disabled: "disabled"
                });
            }
            return res.redirect('../');
        }
        calculateTotal(cart, req);
        if (user.is_admin == 1) {
            return res.render('upload', {
                Cart_List: cart,
                total: total,
                count: count,
                logout: user.name.toUpperCase(),
                isAdmin: "Admin",
                a: "a",
                checkout: "/checkout"
            });
        }
        return res.redirect('../');
    }
}

const addItem = async (req, res) => {
    try {
        if (req.body.id != "") {
            await Oil.updateOne({
                _id: req.body.id
            },
                {
                    $set: {
                        code: req.body.code.toUpperCase(),
                        name: req.body.name,
                        botname: req.body.botname,
                        size: req.body.size,
                        quantity: req.body.quantity,
                        price: req.body.price,
                        discount: req.body.discount,
                        sale_price: req.body.sale_price,
                        image: req.file.filename
                    }
                });
        }

        else {
            var ele = await Oil.find({ code: req.body.code.toUpperCase() });
            if (ele.length == 1) {
                return res.render('upload', { exist: "**Element Code Already Exist..." })
            }
            const oilData = new Oil({
                code: req.body.code.toUpperCase(),
                name: req.body.name,
                botname: req.body.botname,
                size: req.body.size,
                quantity: req.body.quantity,
                price: req.body.price,
                discount: req.body.discount,
                sale_price: req.body.sale_price,
                image: req.file.filename
            })

            const data = await oilData.save();
        }
        Oil.find({}, function (err, data) {
            if (err) {
                console.log('error while loading data', err);
                return;
            }
            else {
                res.redirect('./editDelete');
            }
        })
    }
    catch (e) {
        res.send(e);
    }
}

const editDelete = (req, res) => {
    try {
        Oil.find({}, async function (err, data) {
            if (err) {
                console.log('error while loading data', err);
                return;
            }
            const token = req.cookies.jwt;
            if (token == undefined) {
                return res.redirect('../login');
            }
            if (token != undefined) {
                const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

                const user = await User.findOne({ _id: verifyUser._id });
                var cart = req.session.cart;
                if (cart == undefined || cart.length == 0) {
                    if (user.is_admin == 1) {
                        return res.render('editDelete', {
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
                    return res.redirect('../');
                }
                calculateTotal(cart, req);
                if (user.is_admin == 1) {
                    return res.render('editDelete', {
                        Oil_List: data,
                        Cart_List: cart,
                        total: total,
                        count: count,
                        logout: user.name.toUpperCase(),
                        isAdmin: "Admin",
                        a: "a",
                        checkout: "/checkout"
                    });
                }
                return res.redirect('../');
            }
        })
    }
    catch (e) {
        res.send(e);
    }
}

const editItem = async (req, res) => {
    try {
        Oil.findById(req.body.id, (err, data) => {
            if (err) {
                console.log('error while loading data', err);
                return;
            }
            else {
                res.render('upload', {
                    code: data.code,
                    name: data.name,
                    botname: data.botname,
                    size: data.size,
                    quantity: data.quantity,
                    price: data.price,
                    discount: data.discount,
                    sale_price: data.sale_price,
                    image: data.image,
                    id: req.body.id
                });
            }
        })
    }
    catch (e) {
        res.send(e);
    }
}

const deleteItem = async (req, res) => {
    Oil.findByIdAndRemove(req.body.id, (err, doc) => {
        if (!err) {
            res.redirect('editDelete');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
}

module.exports = {
    loadAdmin,
    getUpload,
    addItem,
    editDelete,
    editItem,
    deleteItem
}
