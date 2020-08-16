import React,{useState,useEffect} from "react"
var userId
if(localStorage.getItem("user"))
   userId=JSON.parse(localStorage.getItem("user"))._id
else
   userId=""
const FollowingPost = ()=>{
   const [data,setData]=useState([])
   useEffect(()=>{
      fetch("/followingPost",{
         headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
         }
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         setData(result.posts)
      })
   }
   ,[])

   const likePost=(id)=>{
      fetch("/like",{
         method:"put",
         headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
            postId:id
         })
      }).then(res=>res.json())
      .then(result =>{
         // console.log(result)
         const newData = data.map(item=>{
            if(item._id===result._id)
               return result
            return item
         })
         setData(newData)
      }).catch(err=>{console.log(err)})
   }
   const unlikePost= (id)=>{
      fetch("/unlike",{
         method:"put",
         headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
            postId:id
         })
      }).then(res=>res.json())
         .then(result =>{
            // console.log(result)
            const newData = data.map(item=>{
               if(item._id===result._id)
                  return result
               return item
            })
            setData(newData)
         }).catch(err=>{console.log(err)})
   }
   const makeComment=(text,postId)=>{
      fetch("/comment",{
         method:"put",
         headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt") 
         },
         body:JSON.stringify({
            postId,
            text
         })
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         const newData = data.map(item=>{
            if(item._id===result._id)
               return result
            return item
         })  
         setData(newData)    
      }).catch(err=>{console.log(err)})
   }
   const deletePost=(postId)=>{
      fetch(`/deletePost/${postId}`,{
         method:"delete",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
         }
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         const newData=data.filter(item=>{
            return item._id !== result._id
         })
         setData(newData)
      })
   }
   return( 
      <div className="home">
         {
            data.slice(0).reverse().map(item=>{
               return(
                  <div className="card home-card" key={item._id}>
                  <h5>{item.postedBy.name}
                     {item.postedBy._id===userId 
                        && <button style={{float:"right"}}
                           onClick={()=>deletePost(item._id)} >
                        <i className="material-icons" > delete</i>
                     </button>
                        }
                     
                  </h5>
                  <div className="card-image">
                     <img src={item.photo} alt="Reload" />
                  </div>
                  <div className="card-content">
                  <i className="medium material-icons " style={{color:"red"}}>favorite</i>
                  {item.likes.includes(userId) ?
                     <i className="material-icons"onClick={()=>{unlikePost(item._id)} }> thumb_down</i>
                     :  
                     <i className="material-icons"onClick={()=>{likePost(item._id)}}> thumb_up</i>
                     }
                  
                     <h6>{item.likes.length} likes</h6>
                     <h6>{item.title}</h6>
                     <p>{item.body}</p>
                     {
                        item.comments.map(record=>{
                           return(
                           <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}:</span> {record.text}</h6>
                           )
                        })
                     }
                     <form onSubmit={(e)=>{
                        e.preventDefault()
                        makeComment(e.target[0].value,item._id)
                     }} >
                        <input type="text" placeholder="comment"></input>
                     </form>
      
                  </div>
               </div>
               )
            }) 
         }      
    </div>
   )
}
export default FollowingPost