import React,{useEffect,useState,useContext} from "react"
import {UserContext} from "../../App"
import {useParams,useHistory} from "react-router-dom"
const loggedInUser=JSON.parse(localStorage.getItem("user"))
const ProfileOfUser = ()=>{
    const [UserProfile,setProfile]=useState(null)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const {userId} = useParams()
    const [showFollow,setShowFollow]=useState(loggedInUser ? !loggedInUser.following.includes(userId):true)
    console.log(userId)
    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }
        ).then(res=>res.json())
        .then(result=>{
            if(userId==JSON.parse(localStorage.getItem("user"))._id){
                history.push("/profile")
                return
            }
            console.log(result)
            setProfile(result)
        })
    },[])
    const followUser = ()=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
            })
            setShowFollow(false)
        })
    }
    const unFollowUser = ()=>{
        fetch("/unFollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unFollowId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower= prevState.user.followers.filter(item=>item !== data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
            })
            setShowFollow(true)
        })
    }

    return( 
        <> 
        {UserProfile ?  
            <div style={{maxWidth:"550px", margin:"0px auto"}}>
                <div style={{
                        display:"flex",
                        justifyContent:"space-around",
                        margin:"18px 0px",
                        borderBottom:"1px solid gray"
                    }}>
                    <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                            src={UserProfile.user.pic?UserProfile.user.pic:"https://res.cloudinary.com/rohit1coding/image/upload/v1597177416/No_Image_Profile_pic_oqjp1i.png"}
                            
                        />
                    </div>
                        
                    <div >
                        <h4> {UserProfile.user.name} </h4>
                        <h4> {UserProfile.user.email} </h4>
                        <div style={{
                            display:"flex",
                            justifyContent:"space-between",
                            width:"110%"
                        }}>
                            <h6>Posts {UserProfile.posts.length} </h6>
                    <h6>Followers {UserProfile.user.followers.length}</h6>
                            <h6>Followings {UserProfile.user.following.length}</h6>
                            {showFollow?
                            <button className="btn waves-effect #6a1b9a red darken-3" type="submit" name="action"
                                onClick={()=>followUser()}>
                                    Follow
                            </button>
                            :   
                            <button className="btn waves-effect #6a1b9a purple darken-3" type="submit" name="action"
                                onClick={()=>unFollowUser()}>
                                    Unfollow
                            </button>
                            }
                            
                            
                        </div>
                    </div>
                </div>
            
            <div className="gallary">
                {
                    UserProfile.posts.map(item=>{
                        return(
                            <img className="item" key={item._id} src={item.photo} alt="Reload" />
                        )
                    })
                }
            </div>

            </div>
        :<h2 style={{textAlign:"center",color:"red"}}>Loading...!!</h2>}
        </>
    )
}
export default ProfileOfUser