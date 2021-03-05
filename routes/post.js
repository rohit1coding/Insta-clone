const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")

// View all posts
router.get("/allPost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{console.log(err)})
})
// View Followers Post only
router.get("/followingPost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{console.log(err)})
})

// View myPost only
router.get("/myPost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myPost =>{
        res.json({myPost})
    })
    .catch(err =>{console.log(err)})
})
// Create Post
router.post("/CreatePost",requireLogin,(req,res)=>{
    const {title,body,picUrl}  = req.body
    if(!title || !body || !picUrl)
        return res.status(422).json({error:"Please add all the fields"})
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        userPic:req.user.pic,
        photo:picUrl,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    })
    .catch(err => {console.log(err)})
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id},
        },
        {new:true
        }).exec((err,result)=>{
            if(err)
                return res.status(422).json({error:err})
            res.json(result)
        })
})
router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id},
        },
        {new:true
        }).exec((err,result)=>{
            if(err)
                return res.status(422).json({error:err})
            res.json(result)
        })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment},
        },
        {new:true
        })
        .populate("comments.postedBy","_id name")
        .populate("postedBy","_id name")
        .exec((err,result)=>{
            if(err)
                return res.status(422).json({error:err})
            res.json(result)
        })
})

router.delete("/deletePost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post)
            return res.status(422).json({error:err})
        if(post.postedBy._id.toString()==req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{console.log(err)})
        }
    })
})
module.exports = router;