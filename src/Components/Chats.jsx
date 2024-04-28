import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import { format } from 'date-fns'; 


function Chats() {

  const[chats,setChats]=useState([]);
  const {currentUser}=useContext(AuthContext)
  const {dispatch}=useContext(ChatContext)

  useEffect(()=>{
    const getChats=()=>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
     });
     return ()=>{
       unsub();
     };
    };
    currentUser.uid && getChats()
  
  },[currentUser.uid]);

  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u})
  }
  const getTime = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), 'hh:mm a');
    } else {
      return ''; 
    }
  };
  

  return (
    <div className='chats mt-2'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map(chat=>(
         <div className="userChat w-100" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
       <img  src={chat[1].userInfo.photoURL} alt=""  style={{objectFit: "cover", borderRadius: "50%",width: "45px", height: "45px", }}/>
         <div className="userChatInfo mt-3 w-75">
           <span className='fw-bolder'>{chat[1].userInfo.displayName}</span>
           <div className='d-flex justify-content-between'>
           <p style={{fontSize:"12.5px",color:"grey",maxWidth:"100px",fontWeight:"600"}}>{chat[1].lastMessage?.text}</p>
           <span  style={{ fontSize: '10px', color: 'grey' }}>{getTime(chat[1].date)}</span> 
           </div>
         </div>
       </div>
      ))}
      
    </div>
  )
}

export default Chats