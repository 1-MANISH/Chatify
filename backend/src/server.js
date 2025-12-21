// same as server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// routes import 
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

const __dirname = path.resolve()//process.cwd();

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


// static files for production
if(nodeEnv ==='production'){

        // serve static files -assets
        app.use(express.static(path.join(__dirname,'../frontend/dist')))

        // handle SPA-routing - other than api routes
        app.get(/.*/,(_req,res)=>{
                res.sendFile(path.join(__dirname,'../frontend','dist','index.html'))
        })
}       


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});