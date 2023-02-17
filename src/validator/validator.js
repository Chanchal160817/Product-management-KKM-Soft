// ======================Import mongoose==============//
const mongoose = require("mongoose");

// ===============Validate Email================//
const isValidEmail = function (mail) {
  if (/^[a-z0-9_]{1,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/.test(mail)) {
    return true;
  }
};

// ===============Validate Password================//
const isValidPassword = function (password) {
  if (
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(
      password
    )
  )
    return true;
  return false;
};

// ===============Validate Name===================//
const isValidName = function (name) {
  if (/^[A-Z][a-z]{2,}\s[A-Z][a-zA-Z]{2,}$/.test(name)) return true;
  return false;
};

// ===============Validate Phone================//
const isValidPhone = function (phone) {
  if (/^[\s]*[6-9]\d{9}[\s]*$/gi.test(phone)) return true;
  return false;
};

// ===============Validate Price================//
const isValidPrice = function (price) {
  if (/^[0-9]*$/.test(price)) return true;
  return false;
};

// ===============Validate Id================//
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

// ==========================Validate Field is Empty or not=======================//
const isValidRequestBody = function(requestBody){
  if(Object.keys(requestBody).length>0)return true
  return false
}

// ===============Validate Quantity================//
const isValidQuantity = function(quantity){
  var regex = /[0-9]{1,9}/;
  if(regex.test(quantity)) return true
  return false
}

// ===============Validate Product Name================//
const isValidProductName = function (productName) {
  const nameRegex = /^[a-zA-Z_ ]*$/;
  if(nameRegex.test(productName)) return true
  return false
}
// ==============================Export Module==============//
module.exports = {
  isValid,
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  isValidObjectId,
  isValidRequestBody,
  isValidPrice,
  isValidQuantity,
  isValidProductName
};
