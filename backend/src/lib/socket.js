import {Server} from "socket.io"
import http from "http"
import express from "express"
import {ENV} from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.middleware.js";
import { GET_ONLINE_USERS } from "./events.js";


// we are using socket on top of express application

// express server
const app =  express()
const server = http.createServer(app) // http server

// socketServer=io
const io = new Server(
        server,{
                cors:{
                        origin:[ENV.CLIENT_URL],
                        credentials:true
                }
        }
)

// apply authentication middleware to all socket connections - first runs this one
io.use(socketAuthMiddleware)

// get socketId by userId - to check if user is online
export function getReceiverSocketId(userId){
        return userSocketMap[userId]
}

// online users
const userSocketMap = {}; //{userId:socketId}


// someone connected
io.on('connection',(socket)=>{

        // console.log(`Socket connection established : ${socket.user.fullName}`);

        userSocketMap[socket.userId] = socket.id;

        // listening to events from client

        // io.emit is used to send events to all connected clients
        io.emit(GET_ONLINE_USERS,Object.keys(userSocketMap)); // only userIds

        // io.to(socketId).emit is used to send events to a specific client
        // with socket.on we can listen to events from client
        // someone disconnected
        socket.on('disconnect',()=>{    
                console.log(`Socket connection closed : ${socket.user.fullName}`);
                delete userSocketMap[socket.userId];
                // updated online users - send to all
                io.emit(GET_ONLINE_USERS,Object.keys(userSocketMap));
        })

})


export {io,app,server}


