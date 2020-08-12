import React,{useState,useEffect} from "react"
import {useHistory} from "react-router-dom"
import M from "materialize-css"

const CreatePost = ()=>{
    const [title,setTitle]=useState("")
    const [body , setBody]= useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const history = useHistory("")
    useEffect(()=>{
        if(url){
        fetch("/CreatePost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                 "Authorization":"Bearer "+ localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                title,
                body,
                picUrl:url
            })
        }).then(res => res.json())
        .then(data =>{
            if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
              return
            }
            M.toast({html:"Post Created Successfully!",classes:"#388e3c green darken-2"})
            history.push("/")
            })
            .catch(err =>{console.log(err)})
        }
    },[url])
    const postDetails =()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","rohit1coding")
        fetch("https://api.cloudinary.com/v1_1/rohit1coding/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
            .then(data=>{
                setUrl(data.url)
            })
        .catch(err=>console.log(err))
        
    }
 
    return(
        <div className="card input-filed" style={{
            width:"550px",
            margin:"50px auto",
            padding:"20px",
            textAlign:"center"
        }}>
            <input type="text" placeholder="title"
                value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input type="text" placeholder="body"
                value={body} onChange={(e)=>setBody(e.target.value)} />

            <div className="file-field input-field">
            <div className="btn">
                <span>Upload image</span> 
                <input type="file" onChange={(e)=>setImage (e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect #6a1b9a purple darken-3" type="submit" name="action"
            onClick={()=>postDetails()}>
                    Submit Post
                </button>
        
        </div>
    )
}
export default CreatePost