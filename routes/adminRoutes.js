const express=require('express')
const adminController=require('../controllers/adminController')
const { route } = require('./userRoutes')
const upload = require('../middleware/multer')
const adminAuth = require('../middleware/adminAuth')
const router=express.Router()

router.post('/admin/login',adminController.adminLogin)
router.post('/admin/addproduct',adminAuth, upload.single('productImage'), adminController.addProduct);
router.get('/admin/products',adminAuth,adminController.productGet)
router.delete('/admin/deleteproduct/:id', adminAuth, adminController.deleteProduct);
router.get('/admin/cartdetails',adminAuth,adminController.userCardetails)

module.exports=router