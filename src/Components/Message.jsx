import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { format } from 'date-fns'; 

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const getTime = (timestamp) => {
    return format(timestamp.toDate(), 'hh:mm a');
  };

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'} mt-2`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" style={{ objectFit: 'cover', borderRadius: '50%', width: '37px', height: '37px' }} />
        <span className='mt-1' style={{fontSize:"11px",color:"black"}}>{getTime(message.date)}</span> 
      </div>
      <div className="messageContent">
        <p className='paraUser'>{message.text}</p>
        {message.img && <img width={160} height={150} src={message.img} alt="" style={{ objectFit: 'contain' }} />}
      </div>
    </div>
  );
}

export default Message;
