import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({

        allContacts:[],
        chats:[],
        messages:[],
        activeTab:'chats',
        selectedUser:null,
        isUsersLoading:false,
        isMessagesLoading:false,
        isSoundEnabled:localStorage.getItem('isSoundEnabled') === "true",
        isSendMessageLoading:false,

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
                        if(!get().selectedUser) throw new Error('No user selected')
                       const res = await  axiosInstance.get(`/messages/${get().selectedUser._id}`) 
                       set({messages:res.data.messages})
                       set({isMessagesLoading:false})
                } catch (error) {
                        console.log(`Error getting  messages: ${error}`)
                        toast.error(`Failed to get  messages : ${error.response?.data?.message || 'Something went wrong'}`);
                }finally{
                        set({isMessagesLoading:false})
                }
        },
        
        sendMessageToUser:async(data)=>{
                set({isSendMessageLoading:true})

                // access things from another store in zustand
                const{authUser} = useAuthStore.getState()
                const tempId = `temp-${Date.now()}`

                const optimisticMessage = {
                        _id:tempId,
                        senderId:authUser?._id,
                        receivedId:get().selectedUser?._id,
                        text:data?.text,
                        image:data?.image,
                        createdAt:new Date().toISOString(),
                        isOptimistic:true// flag to indicate that this is a optimistic message
                }
                try {

                        if(!get().selectedUser) throw new Error('No user selected')
                         // immedidate update in UI
                        set({messages:[...get().messages,optimisticMessage]})
                        const res = await  axiosInstance.post(`/messages/send/${get().selectedUser._id}`,data)
                        set({messages:get().messages.map(message=>message._id === tempId ? res.data.newMessage : message)})
  
                } catch (error) {
                        console.log(`Error sending message: ${error || 'Something went wrong'}`)
                        set({messages:[...get().messages.slice(0,-1)]})
                        toast.error(`Failed to send message : ${error.response?.data?.message || 'Something went wrong'}`);
                }finally{
                        set({isSendMessageLoading:false})
                }
        }

}))