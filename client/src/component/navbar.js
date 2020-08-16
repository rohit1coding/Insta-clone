import React,{useContext} from "react";
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../App"
const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li className="list-item"><Link to="/FollowingPost">Following Posts</Link></li>,
        <li className="list-item"><Link to="/Profile">Profile</Link></li>,
        <li className="list-item"><Link to="/CreatePost">Create Post</Link></li>,
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
      <nav className="collapse.navbar-collapse navbar-expand- #7c4dff deep-purple accent-2">
        <div className="container">
          <div className="nav-wrapper white">
            <Link to={state?"/":"login"} className="brand-logo left" style={{marginLeft:"150px"}}>Home</Link>
            <ul id="nav-mobile" className=" dropdown-menu left" style={{marginLeft:"250px"}}>
              {/* <li style={{width:"120px"}}><input type="text" placeholder="Search" /></li> */}
              <li><i class="material-icons">search</i></li>
            {renderList()}
            </ul>
          </div>
    </div>
</nav>
  )
} 

export default  NavBar;