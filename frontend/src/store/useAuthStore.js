import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';
import {GET_ONLINE_USERS} from '../lib/events';

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set,get)=>({
        authUser:null,
        isCheckingAuth:true,
        isSigningUp:false,
        isLoginIn:false,
        onlineUsers:[],
        socket:null,

        checkAuth : async () => {
                try {
                        const res = await axiosInstance.get('/auth/check')
                        set({authUser:res.data.user})
                        get().connectSocket()
                } catch (error) {
                        console.log(`Error checking auth: ${error}`)
                        set({authUser:null})
                }finally{
                        set({isCheckingAuth:false})
                }
        },
        signup :async (data)=>{
                set({isSigningUp:true})
                try {
                        const res = await axiosInstance.post('/auth/signup',data)
                        set({authUser:res.data.user})
                        toast.success('Account created successfully');
                        get().connectSocket()
                } catch (error) {
                        console.log(`Error signing up: ${error}`)
                        set({authUser:null})
                        toast.error(`Failed to create account : ${error.response.data.message}`);
                }finally{
                        set({isSigningUp:false})
                }
        },

        login:async(data)=>{
                set({isLoginIn:true})
                try {
                        const res = await axiosInstance.post('/auth/login',data)
                        set({authUser:res.data.user})
                        toast.success('Logged in successfully');
                        get().connectSocket()
                } catch (error) {
                        console.log(`Error logging in: ${error}`)
                        set({authUser:null})
                        toast.error(`Failed to login : ${error.response.data.message}`);
                }finally{
                        set({isLoginIn:false})
                }
        },
        logout:async()=>{
                try {
                        await axiosInstance.post('/auth/logout')
                        set({authUser:null})
                        toast.success('Logged out successfully');
                        get().disconnectSocket()
                } catch (error) {
                        console.log(`Error logging out: ${error}`)
                        toast.error(`Failed to logout : ${error.response.data.message}`);
                }finally{
                        set({isCheckingAuth:false})
                }
        },
        updateProfile:async(profilePicture)=>{
                try {
                        const res = await axiosInstance.put('/auth/update-profile',{profilePicture})
                        set({authUser:res.data.updatedUser})
                        toast.success('Profile picture updated successfully');

                } catch (error) {
                        console.log(`Error updating profile: ${error}`)
                        toast.error(`Failed to update profile : ${error.response.data.message}`);
                }
        },

        connectSocket:()=>{

               try {
                         const {authUser} = get()
                         console.log(`authUser`,authUser)
                        // either user is not logged in or socket is already connected
                        if(!authUser || get().socket?.connected )return

                        const socket = io(
                                BASE_URL ,
                                {
                                        withCredentials:true// to send the cookies to the server
                                }
                        ) 

                        socket.connect()
                        set({socket:socket})


                        // listen for online users events
                        socket.on(GET_ONLINE_USERS,(userIds)=>{
                                set({onlineUsers:userIds})
                        })

               } catch (error) {
                        console.log(`Error connecting socket: ${error}`)
               }
        },
        disconnectSocket:()=>{
                try{
                        const {socket} = get()
                        if(socket.connected)
                                socket.disconnect()

                }catch(error){
                        console.log(`Error disconnecting socket: ${error}`)
                }
        }
}))