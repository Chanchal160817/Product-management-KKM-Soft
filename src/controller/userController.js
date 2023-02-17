// =====================Import User Model========================//
const userModel = require('../model/user')

// =====================Import Validator========================//
const {
    isValidObjectId,
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidPhone,
    isValid
} = require("../validator/validator");

// ==================Import bcrypt===============================//
const bcrypt = require('bcrypt')

// ==================Import JWT=================================//
const jwt = require("jsonwebtoken")

// ========================Create User/Register user============//
const createUser = async (req, res) => {
    try {
        let data = req.body

        // If Body is Empty
        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, message: 'required field are mandatory' })
        }

        // Destructuring require field
        let { name, email, password, phone } = data

        // If name is missing
        if (!name) return res.status(400).send({ status: false, message: 'name is mandatory' })

        // If name is invalid
        if (!isValidName(name)) return res.status(400).send({ status: false, message: 'name is invalid' })

        // If email is missing
        if (!email) return res.status(400).send({ status: false, message: 'email is mandatory' })

        // If name is invalid
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'email is invalid' })

        // If email already exist
        let emailExist = await userModel.findOne({ email: email })

        // Database call for email
        if (emailExist) return res.status(400).send({ status: false, message: 'email Already exist . please use different email' })

        // If password is missing
        if (!password) return res.status(400).send({ status: false, message: 'password is mandatory' })

        // If password is invalid
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: 'password is invalid! Please use minimum 8 character and maximum 15 character , 1 upercase , 1 lowercase , 1 numeric value and one special symbol' })

        // If phone number is missing
        if (!phone) return res.status(400).send({ status: false, message: 'phone number is mandatory' })

        // If phone number is invalid
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: 'phone number is invalid' })
        const phoneExist = await userModel.findOne({ phone })
        if (phoneExist) return res.status(400).send({ status: false, message: 'phone number already exist' })

        // use Bcrypted password in db
        let salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        // Create user if all testcase pass 
        const user = await userModel.create(data)
        return res.status(200).send({ status: true, message: 'User Registered Successfully', data: user })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ===========================LOGIN===============================================================

const userLogin = async (req, res) => {
    try {
        let data = req.body

        // If Body is Empty
        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, message: 'required field are mandatory' })
        }

        // Destructuring require field
        let { email, password } = data

        // If email is missing
        if (!email) return res.status(400).send({ status: false, message: 'email is mandatory' })

        // If name is invalid
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'email is invalid' })

        // If password is missing
        if (!password) return res.status(400).send({ status: false, message: 'password is mandatory' })

        // If password is invalid
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: 'password is invalid! Please use minimum 8 character and maximum 15 character , 1 upercase , 1 lowercase , 1 numeric value and one special symbol' })

        // DB call for email exist or not 
        const Login = await userModel.findOne({ email: email });

        // if email not exist
        if (!Login) return res.status(404).send({ status: false, message: "Not a register email Id" });

        // Decode Bcypt password
        let decodePwd = await bcrypt.compare(password, Login.password);
        if (!decodePwd) return res.status(400).send({ status: false, message: "Password not match" });

        // Generate Token
        let token = jwt.sign(
            {
                userId: Login._id.toString(),
            },
            "As calm as the sea",
            { expiresIn: "50d" }
        );

        return res.status(200).send({status: true,message: "User login successfull",data: { userId: Login._id, token: token },});
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//=========================Export module========================//
module.exports = { createUser , userLogin }