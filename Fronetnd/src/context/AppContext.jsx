import axios from 'axios';
import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);
axios.defaults.withCredentials = true;
export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
    const getAuthState=async()=>{
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth//authenticated `, { withCredentials: true });
            if (data.success) {
                setIsLoggedIn(true)
                await getUserData();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(()=>{getAuthState()},[])
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
