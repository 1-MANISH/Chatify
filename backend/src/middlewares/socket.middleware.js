
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV } from "../lib/env.js";


export const socketAuthMiddleware = async (socket,next) => {
        try {
                // extract the token from http-only cookies
                const tokenString = socket.handshake.headers.cookie
                // console.log("tokenString",tokenString);
                const token = tokenString?.split("; ").find((row)=>row.startsWith("chatify_jwt_token="))?.split("=")[1];
                // console.log("token",token)

                if(!token){
                        console.log(`Socket connection rejected : No token provided.`);
                        return next(new Error(`Socket connection rejected : No token provided.`));
                }

                const decoded = jwt.verify(token,ENV.JWT_SECRET);

                if(!decoded){
                        console.log(`Socket connection rejected : Invalid token.`);
                        return next(new Error(`Socket connection rejected : Invalid token.`));
                }

                const user = await User.findById(decoded.userId).select("-password");
                if(!user){
                        console.log(`Socket connection rejected : User not found.`);
                        return next(new Error(`Socket connection rejected : User not found.`));
                }

                // attach user details to the socket
                socket.user = user;
                socket.userId = user._id.toString();

                console.log(`Socket authenticated for the user : ${user?.fullName} (${user?._id})`);
                
                next();
        } catch (error) {
                console.log(`Error in socketAuthMiddleware middleware: ${error.message}`);
                return next(new Error(`Socket authentication rejected : ${error.message}`));
        }
}