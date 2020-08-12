import React,{useContext} from "react";
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../App"
const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/FollowingPost">My Following</Link></li>,
        <li><Link to="/Profile">{JSON.parse(localStorage.getItem("user")).name}</Link></li>,
        <li><Link to="/CreatePost">Create Post </Link></li>,
        <li>
          <button className="btn #d32f2f red darken-2" type="submit" name="action"
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push("/Login")
                }}>
                    Logout
                </button>
          </li>
      ]
    }
    else{
      return [
        <li><Link to="/Login">Login</Link></li>,
        <li><Link to="/Signup">Signup</Link></li>
      ]
    }
  }

    return(
      // <div className="navbar-fixed">  </div>
        <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"login"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
      {renderList()}
      </ul>
    </div>
  </nav>
    )
} 

export default  NavBar;