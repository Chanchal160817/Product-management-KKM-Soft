// -------------------Import JWT-------------------------// 
const jwt = require('jsonwebtoken')
const {isValidObjectId} = require('../validator/validator')

// ================Import product model=====================//
const productModel = require('../model/product')

 //------------------⭐Authentication⭐--------------// 
const authentication =  async (req,res,next) =>{
    try {
        let token = req.headers['x-api-key']
        if(!token) return res.status(400).send({status:false,message:'token must be present'})

        let validateToken = jwt.verify(token, "As calm as the sea")
        if (!validateToken) return res.status(402).send({ status: false, msg: "invalid token" })

        req.validateToken = validateToken

        next()
    } catch (err) {
        return res.status(500).send({status:false,message:err.message})
    }
}

//--------------------⭐Authorization⭐--------------------// 
const authorisation = async (req,res,next)=>{
    try {
        let loggedInUser = req.validateToken.userId 
        let data = req.body 
        if(data.userId) {
            if(loggedInUser!=data.userId) return res.status(403).send({status:false,message:'User is not authorized'})
        }
        let productId = req.params.productId
        if(productId){
            if(!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "Invalid productId" })

            let p = await productModel.findById(productId)
            if(!p) return res.status(404).send({ status: false, msg: "Product does not exist" })

            if(p.isDeleted==true) return res.status(400).send({ status: false, msg: "requested Product is already deleted" })
            let requestingUser = p.userId
            if(loggedInUser!=requestingUser) return res.status(403).send({ status: false, msg: "User is not authorised" })
        }
        next()
    } catch (err) {
        return res.status(500).send({status:false,message:err.message})
    }
}

// ----------------Export authentication and authorization----------------//
module.exports ={authentication,authorisation}