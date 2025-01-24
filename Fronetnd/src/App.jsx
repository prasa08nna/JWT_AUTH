import React from "react"
import { Routes,Route } from "react-router-dom"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import ResetPassword from "./Pages/ResetPassword"
import EmailVerify from "./Pages/EmailVerify"
import { ToastContainer } from 'react-toastify';

function App() {
  return(
   <div>
      <ToastContainer/>
      <Routes>
          <Route  path="/" element={<Home/>}/>
          <Route  path="/login" element={<Login/>}/>
          <Route  path="/resetPassword" element={<ResetPassword/>}/>
          <Route  path="/emailVerify" element={<EmailVerify/>}/>
      </Routes>
   </div>
  )
}

export default App
