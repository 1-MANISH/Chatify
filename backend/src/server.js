// same as server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes import 
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// middleware 
app.use(express.json({limit:'10mb'}));// for json data
app.use(express.urlencoded({limit:'10mb',extended:true}));//for form data
app.use(cors({origin:process.env.CLIENT_URL,credentials:true // allow cookies , auth headers , sessionIds , jwt in cookies
}));// enabling cors for cross origin requests
app.use(cookieParser());// to parse cookies from request
// httpOnly , secure (https sent :for local-dev set secure to false, for production set to true)
// sameSite - to prevent csrf [strict , lax(dev) , none(prod)]


// Health check endpoint
app.get('/api/health', (req, res) => {
        res.json({ status: 'OK' });
});

// main-routes configuration
app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});