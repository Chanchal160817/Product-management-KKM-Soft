//========================Import mongoose==============//
const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

// ======================Create schema==============//
const productSchema = new mongoose.Schema({
    userId : {
        // Refer user collection
        type: ObjectId,
        ref:"User",
        require:true
    },
    productName :{
        type:String,
        require: true
    },
    price:{
        type:Number,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    active:{
        type: Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps: true})

//=====================Export Schema =========================//
module.exports = mongoose.model("Product",productSchema)