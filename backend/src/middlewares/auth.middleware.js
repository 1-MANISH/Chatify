
import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import { User } from '../models/user.model.js';

export const protectedRoute = async(req,res,next)=>{
        try {

                const token =req.cookies.chatify_jwt_token;

                if(!token){
                        return res.status(401).json({message:'Unauthorized access. No token provided.'});
                }
                const decoded = jwt.verify(token,ENV.JWT_SECRET);

                if(!decoded){
                        return res.status(401).json({message:'Unauthorized access. Invalid token.'});
                }

                const user = await User.findById(decoded.userId).select("-password")
                if(!user){
                        return res.status(401).json({message:'Unauthorized access. User not found.'});
                }
                req.user = user;
                next();
        } catch (error) {
                console.log(`Error in protectedRoute middleware: ${error.message}`);
                return res.status(500).json({message:'Internal Server Error'});
        }
}