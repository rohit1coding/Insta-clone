import React,{useState,useContext} from "react"
import {Link,useHistory} from "react-router-dom"
import M from "materialize-css"
import {UserContext} from "../../App"

const Login = ()=>{
    const {dispatch}=useContext(UserContext)
        const [password,setPassword]=useState("")
        const [email,setEmail]=useState("")
        const history = useHistory("")
    
        const postData = ()=>{
            
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            {
                M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
                  return
            }
            fetch("/login",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    password,
                    email
                })
            }).then(res => res.json())
            .then(data =>{
                console.log(data)
                if(data.error){
                  M.toast({html: data.error, classes:"#c62828 red darken-3"})
                  return
                }
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))

                dispatch({ype:"USER", payload:data.user})

                M.toast({html:"Login Successfully!",classes:"#388e3c green darken-2"})
                history.push("/")
                })
                .catch(err =>{console.log(err)})
        }

    return (
        <div className="myCard">
            <div className="card auth-card ">
               <h2>Instagram</h2>
               <input type="email" placeholder ="Enter email"
                    value={email} onChange={(e)=>setEmail(e.target.value)}></input>  
               <input type="password" placeholder ="Enter Password" 
                    value={password} onChange={(e)=>setPassword(e.target.value)}></input> 
                            
                <button className="btn waves-effect #6a1b9a purple darken-3" type="submit" name="action"
                onClick={()=>postData()}>
                    Login
                </button>
                <h5><Link to="/Signup">Don't have an Account ?</Link></h5>
            </div>
        </div>
    )
}
export default Login