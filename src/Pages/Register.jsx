import React, { useState } from 'react';
import "./style.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false); // New state variable for loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const uid = user.uid;

      const storageRef = ref(storage, `${uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          setLoading(false); // Reset loading to false in case of error
          setErr(true);
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateProfile(user, {
                displayName: displayName,
                photoURL: downloadURL
              });

              await setDoc(doc(db, "users", uid), {
                uid: uid,
                displayName: displayName,
                email: email,
                photoURL: downloadURL
              });
              await setDoc(doc(db,"userChats",uid),{})
              navigate('/login')
            })
            .catch((error) => {
              setLoading(false); // Reset loading to false in case of error
              setErr(true);
              console.error("Error getting download URL:", error);
            });
        }
      );
    } catch (error) {
      setLoading(false); // Reset loading to false in case of error
      setErr(true);
      console.error("Error creating user:", error);
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", backgroundColor: "#a7bcff" }}>
      <div className='reg rounded'>
        <img width={70} src="https://cdn.iconscout.com/icon/free/png-256/free-chat-2130787-1794829.png?f=webp" alt="" />
        <h2 className='fw-light mt-2'>Sign Up</h2>
        <p className='mt-3' style={{ fontSize: "13px", color: "#666666" }}>just a few quick things to get started</p>
        <br />
        <form onSubmit={handleSubmit}>
          <input className='inpt' type="text" placeholder='Username' />
          <input className='inpt mt-3' type="email" placeholder='Email' />
          <input className='inpt mt-3' type="password" placeholder='Password' /><br />
          <div className='ms-2 d-flex align-items-center'>
            <input type="file" className='mt-3 ms-4 d-none' name="" id="file" />
            <label htmlFor="file" className='mt-4 mb-0 d-flex'>
              <i className="fa-regular fa-image ms-4 fa-2xl mt-3" style={{ color: "#666666" }}></i>
              <p className='ms-3 mt-1' style={{ fontSize: "14.5px", color: "#666666" }}>Add an avatar</p>
            </label>
          </div>
          <br />
          <button className='btn btn-primary btn-sm w-75' disabled={loading}>
          {loading ? "Loading...": "Sign Up"}
            </button><br />
          {err && <span className='text-danger'>Something went wrong !!</span>}
        </form>
        <p style={{ fontSize: "14.5px", color: "#666666" }} className='mt-3' >Already have an account? <Link  to={"/login"} style={{textDecoration:"none"}}>
        <span className='text-primary'>Login</span></Link> </p>
      </div>
    </div>
  );
}

export default Register;
