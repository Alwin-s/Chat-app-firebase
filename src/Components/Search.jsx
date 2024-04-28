import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { Spinner } from 'react-bootstrap';

function Search() {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false); // State variable to manage spinner visibility

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    setLoading(true); // Show spinner when searching
    const q = query(collection(db, "users"), where("displayName", "==", userName));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }

    setLoading(false); // Hide spinner after search completes
  };

  const handleKey = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
      setUserName("");
    }
  };

  const handleSelect = async () => {
    // Check whether the group (chats in Firestore) exists, if not create
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // Create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        // Create userchats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        });
      }
    } catch (err) {
    }
    setLoading(false); // Hide spinner after user is selected
    setUser(null);
  };

  return (
    <div className='search' style={{ borderBottom: "1px solid lightgrey" }}>
      <div className="searchForm w-100 mt-1 p-1 ">
        <input type="text" className='w-100 search form-control' style={{ borderRadius: "14px", fontSize: "14px" }} placeholder='Search people and groups....' value={userName} onKeyDown={handleKey} onChange={e => setUserName(e.target.value)} />
      </div>
      {err && <span>User Not Found!</span>}
      {user &&
        <div className="userChat w-100 mt-2" onClick={handleSelect}>
          <img src={user.photoURL} alt="" style={{ objectFit: "cover", borderRadius: "50%", width: "45px", height: "45px", }} />
          <div className="userChatInfo">
            <span className='fw-bolder'>{user.displayName}</span>
          </div>
        </div>
      }
      <div className='text-center'>
      {loading && <div className='mt-4 mb-4'><i class="fa-solid fa-spinner fa-spin fa-2xl text-primary"></i></div>} 
      </div>
    </div>
  )
}

export default Search;
