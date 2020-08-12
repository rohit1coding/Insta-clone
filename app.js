const express = require('express');
const app = express();
const mongoose = require('mongoose');


// mongodb connection
const {MONGOURI}= require('./config/keys');
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB");
})
mongoose.connection.on('error',(err)=>{
    console.log("Not connected to Mongodb,error:",err);
})

// Schema or models
require('./models/users');
require("./models/post")
// router
app.use(express.json())
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require("./routes/user"))

var PORT = process.env.PORT || 5000;
if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
    
}
app.listen(PORT,()=>{
    console.log("Server is running on port= ",PORT);
})