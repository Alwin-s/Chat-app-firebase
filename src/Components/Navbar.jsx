import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

function Navbar() {

  return (
    <>
    <div className='navbar d-flex align-items-center justify-content-between p-2' style={{height:"50px"}}>
      <div>
      <h2 className='fw-bolder'>Chat</h2>
      </div>
      <div style={{paddingBottom:"10px"}}>
        <button onClick={()=>signOut(auth)} className='btn'><img src="https://cdn.pixabay.com/photo/2017/05/29/23/02/logging-out-2355227_1280.png" width={30} alt="" /></button>
      </div>
    
    </div>
    </>
  )
}

export default Navbar