import express from 'express';
import { isAuthenticated, loginUser, logoutUser, registerUser, resetPassword, sendOtpVerification, sendResetOtp, verifyEmail } from '../Controller/auth.controller.js';
import userAuth from '../Middleware/auth.middleware.js';

const routerAuth = express.Router();


routerAuth.post('/register', registerUser);
routerAuth.post('/login', loginUser);
routerAuth.post('/logout', logoutUser);
routerAuth.post('/send-otp', userAuth,sendOtpVerification);
routerAuth.post('/verifyaccount',userAuth,verifyEmail)
routerAuth.get("/authenticated",userAuth,isAuthenticated)
routerAuth.post("/sendresetotp",sendResetOtp)
routerAuth.post("/resetpassword",resetPassword)
export default routerAuth;
