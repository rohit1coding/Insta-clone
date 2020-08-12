const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{type:String,
         default:"https://res.cloudinary.com/rohit1coding/image/upload/v1597177416/No_Image_Profile_pic_oqjp1i.png"},
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
});

mongoose.model("User",userSchema);