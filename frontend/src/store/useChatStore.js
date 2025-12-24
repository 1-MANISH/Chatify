import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { NEW_MESSAGE } from "../lib/events";



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
        },

        subscribeToMessages:()=>{
               try {
                         // listening to any upcoming message from the backend
                        const {selectedUser,isSoundEnabled} = get()
                       

                        if(!selectedUser){
                                return; // means no user selected - so no need to show incoming messages
                                // no selected conversion in UI so no need to show incoming messages
                        }

                        const {socket} = useAuthStore.getState()

                        socket.on(NEW_MESSAGE,(newMessage)=>{

                                const isMessageFromSentFromSelectedUser =  selectedUser._id.toString() === newMessage.senderId.toString()
                                //!!! if msg not from selected user than not sent to the UI
                                if(!isMessageFromSentFromSelectedUser) return

                                const currentMessages = get().messages
                                set({
                                        messages:[...currentMessages,newMessage]
                                })

                                if(isSoundEnabled){
                                        const notificationSound = new Audio('/sounds/notification.mp3')
                                        notificationSound.currentTime=0;
                                        notificationSound.play().catch(err=>console.log(`Error playing sound: ${err}`))
                                }
                        })
               } catch (error) {
                        console.log(`Error subscribing to messages: ${error}`)
               }
        },
        
        unSubscribeFromMessages:()=>{
               try {
                        const {socket} = useAuthStore.getState()
                        socket.off(NEW_MESSAGE)
               } catch (error) {
                        console.log(`Error unsubscribing from messages: ${error}`)
               }
        }

}))