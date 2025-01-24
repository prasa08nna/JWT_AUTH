import express from 'express'
import userAuth from '../Middleware/auth.middleware.js';
import { getUserData } from '../Controller/user.Controller.js';

const userRouter=express.Router();
userRouter.get('/data',userAuth,getUserData)
export default userRouter;