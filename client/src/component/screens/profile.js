import React,{useEffect,useState,useContext} from "react"
import {UserContext} from "../../App"
import M from "materialize-css"
var urrl
const Profile = ()=>{
    const [myPics,setPics]=useState([])
    const user =JSON.parse(localStorage.getItem("user"))
    const [image,setImage]=useState("")
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch("/myPost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.myPost)
        })
    },[])

    useEffect(()=>{
    const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","rohit1coding")
            fetch("https://api.cloudinary.com/v1_1/rohit1coding/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
                .then(data=>{
                    console.log(data.url)
                    urrl= data.url
                    if(urrl)
                        M.toast({html:"pic Will updated when you login again!" ,classes:"#4caf50 green"})
                    fetch("/updatePic",{
                        method:"put",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":"Bearer "+localStorage.getItem("jwt")
                        },
                        body:JSON.stringify({
                            pic:urrl
                        })
                    }).then(result=>{
                        console.log(urrl)
                        user.pic=data.url
                        
                        // localStorage.setItem("user",JSON.stringify({...user,pic:data.pic}))
                        // dispatch({type:"UPDATEPIC",payload:data.url})
                    })
                    // window.location.reload()
                })
            .catch(err=>console.log(err)) 
    },[image])
    
    const updatePhoto=(file)=>{
        setImage(file)
       
        
    }
    return( 
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid gray"
                }}>
                <div >
                    <div>
                        <img style={{width:"160px",height:"175px",borderRadius:"160px"}}
                            src={user.pic?user.pic:"https://res.cloudinary.com/rohit1coding/image/upload/v1597177416/No_Image_Profile_pic_oqjp1i.png"}
                            alt="Reload"
                        /><br />
                    <div className="file-field input-field" style={{margin:"10px"}} >
                    <div className="btn">
                        <span>Update Pic</span> 
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                    </div>
                </div>  
                <div >
                    <h4> {user.name} </h4>
                    <h6> {user.email} </h6>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"110%"
                    }}>
                        <h6>Posts {myPics.length}</h6>
                        <h6>Followers {user.followers.length}</h6>
                        <h6>Followings {user.following.length}</h6>
                    </div>
                </div>
            </div>
        
        <div className="gallary">
            {
                myPics.map(item=>{
                    return(
                        <img style={{marginTop:"10px"}} className="item" key={item._id} src={item.photo} alt="Reload" />
                    )
                })
            }
        </div>

        </div>
    )
}
export default Profile