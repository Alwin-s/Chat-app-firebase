import React from 'react'
import Navbar from './Navbar'
import Search from "../Components/Search"
import Chats from "../Components/Chats"
function SideBar() {
  return (
    <div className='sidebar'>
      <Navbar/>
      <Search/>
      <Chats/>
    </div>
  )
}

export default SideBar