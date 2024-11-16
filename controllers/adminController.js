const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const Admin=require('../models/admin')
const Products=require('../models/products')
const cloudinary=require('../services/cloudinary')
const Cart = require('../models/cart')
const User=require('../models/user')
const { response } = require('express')

const adminLogin=async(req,res)=>{
    console.log('hitting the admin login function')
    const {email,phoneNumber}=req.body.data

    console.log('email',email)
    try {
        const admin=await Admin.findOne({email})
        if (admin) {
            console.log('Admin found:', admin);
            const token = jwt.sign(
                {
                    id: admin._id,
                    email: admin.email,
                    phoneNumber: admin.phoneNumber,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            console.log('Token:', token);
            res.cookie('admintoken', token, { httpOnly: false, maxAge: 3600000 });
            return res.status(200).json({message: 'Admin logged in successfully.',token});
        } else {
            console.log('Admin not found');
            return res.status(404).json({
                message: 'Admin not found.',
            });
        }
    } catch (error) {
        console.log('error in the admin login section',error)
    }
}


const addProduct = async (req, res) => {
    const { productName, brand, price, discount } = req.body;
    try {
        const image = req.file;
        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }
        const result = await cloudinary.uploader.upload(image.path, { folder: 'QuickFix' });
        const imageUrl = result.secure_url;
        console.log('image url',imageUrl)
        const newProduct = new Products({
            productName,
            brand,
            price,
            discount,
            productImage: imageUrl
        });
        console.log('new product',newProduct)
        newProduct.save();
        console.log('product addess success')
        res.status(200).json({ message: "Product added successfully" ,});
    } catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
};


const productGet=async(req,res)=>{
    console.log('hittting the fetch product')
    try {
        const products=await Products.find()
        console.log('prdoucts',products)
        res.status(200).json(products)
    } catch (error) {
        console.log('error in the fetching products')
    }
}
const deleteProduct = async (req, res) => {
    console.log('Hitting the delete function');
    const { id } = req.params;  
    console.log(id);
  
    try {
      const result = await Products.findByIdAndDelete(id);
      console.log('product for the delete ',result)
      
      if (result) {
        return res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return res.status(500).json({ message: 'Error deleting product' });
    }
  };
  

  const userCardetails = async (req, res) => {
    console.log('Hitting the user cart details function');
    try {
      const carts = await Cart.find();
  
      const detailedCarts = await Promise.all(
        carts.map(async (cart) => {
          const user = await User.findById(cart.userId);
          
          const products = await Products.find({
            '_id': { $in: cart.productId },
          });
          console.log('prdoucts',products);
          
          return {
            cartId: cart._id,
            userDetails: user,
            products: products,
          };
        })
      );
  
      console.log('User Cart Details with User and Product:', detailedCarts);
  
      res.status(200).json(detailedCarts);
  
    } catch (error) {
      console.log('Error in the service section:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
module.exports={
    adminLogin,
    addProduct,
    productGet,
    deleteProduct,
    userCardetails,
}

