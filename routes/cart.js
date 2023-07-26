const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart' , isLoggedIn , async(req,res)=>{
    const user = await User.findById(req.user._id).populate('cart');
    const totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    const productInfo = user.cart.map((p)=>p.desc).join(',');
    res.render('cart/cart' , {user, totalAmount , productInfo });
})


router.post('/user/:productId/add' , isLoggedIn , async(req,res)=>{
    let {productId} = req.params;
    let userId = req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart'); 
})

router.delete("/user/:productId/delete",async (req, res) => {
    try{
        let { productId } = req.params;
        let userId = req.user._id;
        let user = await User.findById(userId);
        let newCart = [];
        for (let product of user.cart) {
            if (!product.equals(productId)) {
                newCart.push(product)
            }
        }
        user.cart = newCart;
        await user.save();
        res.redirect('/user/cart');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }

})

module.exports = router;