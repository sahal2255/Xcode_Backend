const express=require('express')
const userController=require('../controllers/userController')
const userAuth = require('../middleware/userAuth')

const router=express.Router()


router.post('/userlogin',userController.userLogin)
router.get('/products',userController.fetchProduct)
router.post('/addtocart/:productId',userAuth,userController.addToCart)
router.get('/cart',userAuth,userController.cartGet)

module.exports=router