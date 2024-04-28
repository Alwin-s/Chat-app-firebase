import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { Spinner } from 'react-bootstrap';

function Login() {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false); // State variable to manage spinner visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      setLoading(true); // Show spinner when submitting
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      setErr(true);
    } finally {
      setLoading(false); // Hide spinner after submission
    }
  };

  return (
    <div>
      <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", backgroundColor: "#a7bcff" }}>
        <div className='reg rounded'>
          <img width={70} src="https://cdn.iconscout.com/icon/free/png-256/free-chat-2130787-1794829.png?f=webp" alt="" />
          <h2 className='fw-light mt-2'>LogIn </h2>
          <p className='mt-3' style={{ fontSize: "13px", color: "#666666" }}>Hello, Welcome Back</p>
          <br />
          <form onSubmit={handleSubmit} >
            <input className='inpt mt-3' type="email" placeholder='Email' />
            <input className='inpt mt-4' type="password" placeholder='Password' /><br />
            <br />
            <button className='btn btn-primary btn-sm w-75 mt-5' disabled={loading}> {/* Disable button while loading */}
              {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"} {/* Show spinner or button text */}
            </button><br />
            {err && <span className='text-danger'>Something Went Wrong</span>}
          </form>
          <p style={{ fontSize: "14.5px", color: "#666666" }} className='mt-3' >Don't have an account? <Link to={"/register"} style={{ textDecoration: "none" }}>
            <span className='text-primary'>SignUp</span></Link> </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
