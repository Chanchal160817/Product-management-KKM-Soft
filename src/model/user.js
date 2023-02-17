//========================Import mongoose==============//
const mongoose = require('mongoose')

// ======================Create schema==============//
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        require:true 
    },
    phone:{
        type:String,
        require:true, 
        unique: true
    }
},{timestamps: true })

//=====================Export Schema =========================//
module.exports = mongoose.model("User",userSchema)