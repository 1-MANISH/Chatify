import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set,get)=>({

        allContacts:[],
        chats:[],
        messages:[],
        activeTab:'chats',
        selectedUser:null,
        isUsersLoading:false,
        isMessagesLoading:false,
        isSoundEnabled:localStorage.getItem('isSoundEnabled') === "true",

        toggleSound:() =>{
                localStorage.setItem('isSoundEnabled',!get().isSoundEnabled)
                set({isSoundEnabled:!get().isSoundEnabled})
        },
        setActiveTab:(tab)=>{
                set({activeTab:tab})
        },
        setSelectedUser:(selectedUser)=>{
                set({selectedUser:selectedUser})
        },

        getAllContacts:async()=>{
                set({isUsersLoading:true})
                try {
                       const res = await  axiosInstance.get('/messages/contacts') 
                       set({allContacts:res.data.contacts})
                       set({isUsersLoading:false})
                } catch (error) {
                        console.log(`Error getting all contacts: ${error}`)
                        toast.error(`Failed to get all contacts : ${error.response.data.message}`);
                }finally{
                        set({isUsersLoading:false})
                }
        },
        getMyChatPartners:async()=>{
                set({isUsersLoading:true})
                try {
                       const res = await  axiosInstance.get('/messages/chats/partner') 
                       set({chats:res.data.chatPartners})
                       set({isUsersLoading:false})
                } catch (error) {
                        console.log(`Error getting all chats: ${error}`)
                        toast.error(`Failed to get all chats : ${error.response.data.message}`);

                }finally{
                        set({isUsersLoading:false})
                }
        },
        getMessagesByUserID:async()=>{
                set({isMessagesLoading:true})
                try {
                       const res = await  axiosInstance.get(`/messages/${get().selectedUser._id}`) 
                       set({messages:res.data.messages})
                       set({isMessagesLoading:false})
                } catch (error) {
                        console.log(`Error getting  messages: ${error}`)
                        toast.error(`Failed to get  messages : ${error.response.data.message}`);
                }finally{
                        set({isMessagesLoading:false})
                }
        }

}))