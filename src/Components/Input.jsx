import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Input() {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [err, setErr] = useState(false);

  const handleSend = async () => {
    // Check if the text input is empty or consists of only whitespace
    if (!text.trim() && !img) {
      // If both text and image inputs are empty, return early and do not send the message
      return;
    }
  
    try {
      if (img) {
        // If an image is selected, upload it to Firebase Storage
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
        
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            setErr(true);
            console.error('Error uploading file:', error);
          },
          () => {
            // Once the image is uploaded, get its download URL
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                // Update chat document with the new message including image
                await updateDoc(doc(db, 'chats', data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: text.trim(), // Trim leading and trailing whitespace from the text
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              })
              .catch((error) => {
                setErr(true);
                console.error('Error getting download URL:', error);
              });
          }
        );
      } else {
        // If no image is selected, update chat document with the new message without image
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: text.trim(), // Trim leading and trailing whitespace from the text
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
    } catch (error) {
      setErr(true);
      console.error('Error sending message:', error);
    }
  
    // Update user chats with last message and timestamp
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text.trim(), // Trim leading and trailing whitespace from the text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });
  
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text.trim(),
      },
      [data.chatId + ".date"]: serverTimestamp()
    });
    setImg(null);  };
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
      setText('');
    }
  };

  return (
    <div className='input'>
      <input
        type='text' value={text}
        className='w-100'
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type a new message..'
        style={{ fontSize: '15px', border: 'none', outline: 'none', paddingLeft: '10px' }}
      />
      <div className='send'>
        <i className='fa-solid fa-paperclip'></i>
        <input type='file' onChange={(e) => setImg(e.target.files[0])} className='d-none' id='file' />
        <label htmlFor='file'>
          <i className='fa-regular fa-image'></i>
        </label>
        <button onClick={handleSend} className='sendBtn'>
          <i className='fa-regular fa-paper-plane'></i>
        </button>
      </div>
    </div>
  );
}

export default Input;
