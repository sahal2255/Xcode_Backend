const mongoose=require('mongoose')
const User = require('../models/user')
const jwt=require('jsonwebtoken');
const Products = require('../models/products');
const Cart=require('../models/cart')

const userLogin = async (req, res) => {
    const { email, phoneNumber } = req.body.data;
    console.log('Form data extracted:', email, phoneNumber);

    try {
        const user = await User.findOne({ email });
        console.log('User found:', user); 

        if (user) {
            const token=jwt.sign(
                {
                    id:user._id,
                    email:user.email,
                    phoneNumber:user.phoneNumber
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'1h'
                }
            )
            console.log('token',token)
            res.cookie('usertoken',token,{ httpOnly: false, maxAge: 3600000 })
            return res.status(200).json({
                message: 'User found and logged in successfully.',
                user, 
            });
        } else {
            const newUser = new User({email,phoneNumber,});
            await newUser.save();
            console.log('New user created:', newUser); 
            const token=jwt.sign(
                {
                    id:newUser._id,
                    email:newUser.email,
                    phoneNumber:newUser.phoneNumber
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'1h'
                }
                
            )
            console.log('token',token)
            res.cookie('usertoken',token,{ httpOnly: false, maxAge: 3600000 })
            return res.status(201).json({
                message: 'New user created successfully.',
                newUser, 
            });
        }
    } catch (error) {
        console.error('Error in the user login section:', error);
        res.status(500).json({ message: 'Server error' }); 
    }
};

const fetchProduct=async(req,res)=>{
    try {
        const products=await Products.find()
        console.log('founded products',products)
        res.status(200).json(products)
    } catch (error) {
        console.log('error for fetching product',error)
    }
}


const addToCart = async (req, res) => {
    console.log('Hitting the add to cart route');
    
    const { productId } = req.params;
    const userId = req.user.id;  
    
    console.log('Product Id:', productId);
    console.log('User Id:', userId);

    try {
        const product = await Products.findById(productId);
        console.log('Product found:', product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({
                userId: userId,
                productId: [productId]  
            });
            await cart.save();
            return res.status(200).json({ message: 'Product added to cart', cart });
        } 

        if (!cart.productId.includes(productId)) {
            cart.productId.push(productId); 
            await cart.save();
            return res.status(200).json({ message: 'Product added to cart', cart });
        } else {
            return res.status(400).json({ message: 'Product is already in the cart' });
        }

    } catch (error) {
        console.log('Error in the add to cart function:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const cartGet = async (req, res) => {
    const userId = req.user.id;
    console.log('User ID:', userId);

    try {
        const cart = await Cart.findOne({ userId: userId });
        console.log('Cart retrieved:', cart);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIds = cart.productId;

        const products = await Products.find({
            '_id': { $in: productIds } // Use $in to match any of the productIds in the array
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found in the cart' });
        }

        return res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: {
                ...cart.toObject(), // Spread the cart details
                products: products // Add the product details to the response
            }
        });
    } catch (error) {
        console.log('Error in getting the cart:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports={
    userLogin,
    fetchProduct,
    addToCart,
    cartGet
}