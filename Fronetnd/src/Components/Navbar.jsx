import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar() {
  const navigate=useNavigate()
  const {userData,backendUrl,setUserData,setIsLoggedIn}=useContext(AppContext)
const sendVerificationOtp=async()=>{
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(`${backendUrl}/api/auth/send-otp`);
    if(data.success){
      navigate("/emailVerify")
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred');
  }
}
  const logOut=async()=>{
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth//logout`);
      if(data.success){
        setIsLoggedIn(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 absolute top-0'>
      <img src={assets.logo} alt="" className='w-26 sm:w-32'/>
      {userData ? 
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        {userData.userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-full right-0 mt-1 w-32 z-10 text-black rounded bg-gray-100'>
          <ul className='list-none m-0 p-2 text-sm'>
            
            {!userData.userData.isAccountVerified &&
             <li onClick={sendVerificationOtp} className='px-2 py-1 hover:bg-gray-200 cursor-pointer' >Verify Email</li>}
           
            <li onClick={logOut} className='px-2 py-1 hover:bg-gray-200 cursor-pointer' >Logout</li>
          </ul>
        </div>
      </div> :
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500  rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all' >Login <img src={assets.arrow_icon} alt="" /></button>
      }
     
    </div>
  )
}

export default Navbar
