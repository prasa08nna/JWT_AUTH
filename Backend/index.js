import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { connectDB } from "./db/database.js";
import routerAuth from "./Routers/auth.router.js";
import userRouter from "./Routers/user.router.js";

const app = express();
const port = process.env.PORT || 8000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("API IS WORKING SUCCESSFULLY");
});
app.use('/api/auth', routerAuth);
app.use('/api/user', userRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running successfully on port ${port}`);
});


export default app;
