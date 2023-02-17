
// ================Import product model===========================================================
const productModel = require('../model/product')

// ======================Import user model==========================================================
const userModel = require('../model/user')

// =====================Validation======================================================================
const {
    isValid,
    isValidObjectId,
    isValidRequestBody,
    isValidPrice,
    isValidQuantity,
    isValidProductName
} = require("../validator/validator");

// ==========================================CRUD operation on Product================================

// ===========================================Create Product =========================================
const createProduct = async (req, res) => {
    try {
        let data = req.body
        let { userId, productName, price, quantity, active, isDeleted } = data
        // If Body is empty
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Provide all required field" });

        // If User id is not present 
        if (!userId) return res.status(400).send({ status: false, message: "UserId name is mandatory" });

        // If user id is invalid
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "UserId name is invalid" });

        // user exist or not 
        const userExist = await userModel.findById(userId)
        if (!userExist) return res.status(400).send({ status: false, message: "user by this id not register" });

        // If product name not present
        if (!productName) return res.status(400).send({ status: false, message: "Product name is mandatory" });

        // if product name is not valid
        if (!isValidProductName(productName)) return res.status(400).send({ status: false, message: "Product name is invalid" });

        // If price is not present
        if (!price) return res.status(400).send({ status: false, message: "Price is mandatory" });

        // If price is not valid
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Price is invalid" });

        // If Quantity is not present
        if (!quantity) return res.status(400).send({ status: false, message: "Quantity is mandatory" });

        // If Quantity is not valid 
        if (!isValidQuantity(quantity)) return res.status(400).send({ status: false, message: "Quantity is invalid" });

        // DB call for create product
        const product = await productModel.create(data)
        return res.status(200).send({ status: true, message: 'Product created Successfully', data: product })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// ===========================================Get Product By Filter====================================
const getProduct = async (req, res) => {
    try {
        // Get product using filter
        let queries = req.query;
        let allProduct = await productModel.find({ $and: [queries, { isDeleted: false }] }).select({ productName: 1, price: 1, userId: 1, quantity: 1, active: 1 }).sort({ price: -1, quantity: -1 });
        if (allProduct.length == 0) return res.status(404).send({ status: false, msg: "No product found" });;
        return res.status(200).send({ status: true, data: allProduct });
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}


// ==========================================Get product by Id=========================================
const getProductById = async (req, res) => {
    try {

        let productId = req.params.productId

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "Invalid ProductId" })

        let productDetails = await productModel.findById(productId)
        if (!productDetails || productDetails.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "Product does not exist" })
        }

        return res.status(200).send({ status: true, data: productDetails });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
}


// ========================================Update product Information By Product ID======================
const updateProduct = async (req, res) => {
    try {
        let productId = req.params.productId
        let data = req.body
        if (!isValidRequestBody) return res.status(400).send({ status: false, message: 'Please provide data' })

        if (data.productName) {
            let name = await productModel.findOne({ productName: data.productName })
            if (name) return res.status(400).send({ status: false, message: 'Product Name already used!' })

            if (!isValidProductName(productName)) return res.status(404).send({ status: false, message: "Invalid Product" })
        }

        let productUpdate = await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: { productName: data.productName, price: data.price, quantity: data.quantity, active: data.active, isDeleted: data.isDeleted } }, { new: true }
        )

        return res.status(200).send({ status: true, message: productUpdate })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// =================================Delete Product By Product ID=======================================
const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        let product = await productModel.findById(productId);
        // ===============================ID not present in db==========================================================
        if (!product)return res.status(400).send({ status: false, message: "product by this id not present in db" });

        // ===============================ID already deleted==========================================================
        if (product.isDeleted == true)  return res .status(404) .send({ status: false, msg: "this product is already deleted" });
        if (product.isDeleted == false) {
            let productDeleted = await productModel.findByIdAndUpdate( { _id: productId },{ $set: { isDeleted: true, deletedAt: new Date() } }, { new: true } );
            return res.status(200).send({ status: true, msg: "product is deleted successfully",data: productDeleted});
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};

// =======================Export module=========================//
module.exports = { createProduct, getProduct, getProductById, updateProduct ,deleteProduct}