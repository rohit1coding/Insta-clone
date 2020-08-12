import React,{useState,useEffect} from "react"
import {Link,useHistory} from "react-router-dom"
import M from "materialize-css"

const Signup = ()=>{
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    const history = useHistory("")

    useEffect(()=>{
        if(url)
            UploadFields()
    })
    const UploadPic =()=>{
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

   
    const UploadFields =()=>{
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
              return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
        .then(data =>{
            if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
              return
            }
            M.toast({html:data.message,classes:"#388e3c green darken-2"})
            history.push("/login")
            })
            .catch(err =>{console.log({err})})
    }
    const postData = ()=>{
        if(image){
            UploadPic()
        }else
            UploadFields()
    }
    
    return (
        <div className="myCard">
            <div className="card auth-card ">
               <h2>Instagram</h2>
               <input type="text" placeholder ="Enter Name"
                    value={name} onChange={(e)=>setName(e.target.value)}></input>  
               <input type="email" placeholder ="Enter email"
                    value={email} onChange={(e)=>setEmail(e.target.value)}></input>  
               <input type="password" placeholder ="Enter Password" 
                    value={password} onChange={(e)=>setPassword(e.target.value)}></input> 
               <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Profile Pic</span> 
                        <input type="file" onChange={(e)=>setImage (e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                            
                <button className="btn waves-effect #6a1b9a purple darken-3" type="submit" name="action"
                onClick={()=>postData()}>
                    SignUp
                </button>
                <h5><Link to="/Login">Already have an Account ?</Link></h5>
            </div>
        </div>
    )
}
export default Signup