import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

function Chat() {
  const {data}=useContext(ChatContext)
  return (
    <>
    <div className='chat'>
      <div className="chatInfo">
        <div>
         <img  src={data.user?.photoURL}   style={{objectFit: "cover", borderRadius: "50%",width: "35px", height: "35px", }}/>
        <span className='fw-bold ms-2'>{data.user?.displayName}</span>  
        </div>
        <div className="chatIcons">
        <i class="fa-solid fa-phone-volume"></i>
        <i class="fa-solid fa-video"></i>
        <i class="fa-solid fa-user-plus"></i>
        <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>
      <Messages/>
      <div style={{position:"fixed",bottom:"6%",width:"49.99%"}}>
      <Input/>  
      </div>
    </div>
    </>
  )
}

export default Chat