import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
        authUser:null,
        isCheckingAuth:true,
        isSigningUp:false,
        isLoginIn:false,

        checkAuth : async () => {
                try {
                        const res = await axiosInstance.get('/auth/check')
                        set({authUser:res.data.user})
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
                } catch (error) {
                        console.log(`Error logging out: ${error}`)
                        toast.error(`Failed to logout : ${error.response.data.message}`);
                }finally{
                        set({isCheckingAuth:false})
                }
        }
}))