const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { json } = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin")
const User = mongoose.model("User")

router.get("/protected",requireLogin, (req,res) =>{
    res.send("Hello User")
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}= req.body;
    if(!email || !password || !name){
        return(res.status(422).json({error:"please add all the fields"}))
    }
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser)
            return(res.status(422).json({error:"User already exists with this email "}))

            bcrypt.hash(password,12)
            .then(hashedPassword =>{
                const user = new User({
                    name,
                    email,
                    password:hashedPassword,
                    pic
                })
                user.save()
                    .then(user =>{
                        res.json({message:"successfully saved"})
                    })
                    .catch(err =>{
                        console.log(err)
                    })

            })
            
        })
        .catch(err =>{console.log(err)})
    
})

router.post("/login",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
        return(res.status(404).json({error:"please enter email or password!!"}));
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser)
            return(res.status(422).json({error:"Invalid email or password"}))
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully sign in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}=savedUser
                res.send({token, user:{_id,name,email,followers,following,pic}});   
            }
            else
            return(res.status(422).json({error:"Invalid email or password"}))

        })
        .catch(err =>{console.log(err)})
    })
});
module.exports = router;