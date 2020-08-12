import React,{useEffect,createContext,useReducer, useContext} from 'react';
import NavBar from "./component/navbar"
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom"
import Home from "./component/screens/home"
import Profile from "./component/screens/profile"
import Login from "./component/screens/login"
import Signup from "./component/screens/signup"
import CreatePost from "./component/screens/createPost"
import {reducer,initialState} from "./reducers/userReducer"
import ProfileOfUser from "./component/screens/UserProfile"
import FollowingPost from "./component/screens/MyFollowingPosts"
import { Collapsible } from 'materialize-css';
export const UserContext= createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:"user"})
    }
    else
      history.push("/login")
  },[])
    return(
    <Switch>
      <Route exact path ="/">
        <Home />
      </Route>
      <Route path ="/Signup">
        <Signup />
      </Route>
      <Route path ="/Login">
        <Login />
      </Route>
      <Route exact path ="/Profile">
        <Profile />
      </Route>
      <Route path="/CreatePost">
        <CreatePost />
      </Route> 
      <Route path="/FollowingPost" >
        <FollowingPost />
      </Route> 
      <Route path="/profile/:userId">
        <ProfileOfUser />
      </Route>
    </Switch>
    )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  // console.log(state)
  return (
    <UserContext.Provider value={{state,dispatch}}> 
      <BrowserRouter>
        <NavBar />
        <Routing />
        </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
