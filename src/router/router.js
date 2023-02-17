//===============Import Express==================//
const express = require('express')

//=================Use Router=====================//
const router = express.Router()

//==================Import User Controller==========//
const {createUser,userLogin} = require('../controller/userController')

//==================Import Product Controller==========//
const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require('../controller/productController')

//==================Import middleware=======//
const { authentication, authorisation} = require('../middleware/authentication')

// ==========Create User===================//
router.post('/createUser',createUser)

// ==========Login User====================//
router.post('/login',userLogin)

// ============Create Product=============//
router.post('/createProduct',authentication,authorisation,createProduct)

// ===============Get Product By filter====//
router.get('/getProduct' ,authentication,getProduct)

//================Get Product By Id =========//
router.get('/getProductById/:productId' ,authentication,getProductById)

// ================Update Product=============//
router.put('/updateProduct/:productId' ,authentication,authorisation,updateProduct)

// ==================Delete Product==============//
router.delete('/deleteProduct/:productId' ,authentication,authorisation,deleteProduct)

// =====================Export Router===========//
module.exports = router