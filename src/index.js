const express = require('express')
const bodyParser = require("body-parser")
const router = require('./router/router')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.json())

// ===============Connect with DB=====================//
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://Chanchal25-DB:ZHrSPQhp8HuOM2Yy@cluster0.ypi01as.mongodb.net/product_Management',{
    useNewUrlParser : true
}) 
.then(()=>{
    console.log('MongoDb is Connected');
})
.catch((err)=>{
    console.log(err);
})

// =================Global middleware==========================//
app.use('/', router);

// ===================Error handle if we use different url apart from api=================//
app.all("/*", function (req, res) {
    res.status(404).send({ status: false, message: "Incorrect URL! Please enter valid Url" });
});

// ====================listen port for server========================//
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});