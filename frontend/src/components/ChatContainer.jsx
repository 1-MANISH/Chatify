import  { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'

const ChatContainer = () => {

        const {messages,isMessagesLoading,getMessagesByUserID,selectedUser} = useChatStore()
        const {authUser} = useAuthStore()

        const messageEndRef = useRef(null)

        useEffect(()=>{
                const fetchMessages = async()=>{
                        try {
                                await getMessagesByUserID()
                        } catch (error) {
                                console.log(`Error getting messages: ${error}`)
                        }
                }
                fetchMessages()
        },[getMessagesByUserID,selectedUser])



        useEffect(() => {
                
               if(messageEndRef.current){
                        messageEndRef.current.scrollIntoView({behavior:"smooth"})
               }
        }, [messages]);

        return (
                <>
                        <ChatHeader />
                        <div className="flex-1 px-6 overflow-y-auto py-8">
                                {
                                        messages && messages.length > 0 && !isMessagesLoading ? (
                                                <div className="max-w-3xl mx-auto space-y-6" >
                                                {
                                                        messages.map((msg,_index)=>{
                                                                const isMyMessage = msg?.senderId?.toString() === authUser?._id?.toString()
                                                                return (
                                                                        <div 
                                                                                key={msg?._id} 
                                                                                className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
                                                                        >
                                                                                {
                                                                                        !isMyMessage && (
                                                                                        <div className="chat-image avatar">
                                                                                                <div className="w-10 rounded-full">
                                                                                                        <img
                                                                                                                alt={selectedUser?.fullName?.toString()}
                                                                                                                src={selectedUser?.profilePicture || "/avatar.png"}
                                                                                                        />
                                                                                                </div>
                                                                                        
                                                                                        </div>
                                                                                        )
                                                                                }
                                                                                
                                                                                <div className="chat-header">
                                                                                        <p > {!isMyMessage && selectedUser?.fullName?.toUpperCase()}</p>
                                                                                                <time className="text-xs opacity-50">
                                                                                                        {
                                                                                                                new Date(msg?.createdAt).toLocaleTimeString(undefined, {
                                                                                                                hour: "2-digit",
                                                                                                                minute: "2-digit",
                                                                                                                })
                                                                                                        }
                                                                                                </time>
                                                                                </div>
                                                                                <div 
                                                                                        className={`chat-bubble ${isMyMessage ? "bg-cyan-600 text-white-200" : "bg-slate-800 text-white-200"}`}
                                                                                        >
                                                                                                        {msg.text && <p className="mt-2 text-white">{msg?.text}</p>}
                                                                                                        {
                                                                                                                msg.image && (
                                                                                                                        <img
                                                                                                                                alt={"shared"}
                                                                                                                                src={msg.image}
                                                                                                                                className='size-36   object-cover rounded-sm'
                                                                                                                        />
                                                                                                                )
                                                                                                        }
                                                                                </div>
                                                                        
                                                                        </div>
                                                                )
                                                        })
                                                }
                                                </div>    
                                                
                                        ):isMessagesLoading ? (
                                                <MessagesLoadingSkeleton />
                                        ):(
                                                <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
                                        )
                                }
                                {/* scroll target */}
                                <div  ref={messageEndRef}/>
                        </div>
                        <MessageInput />
                </>
        )
}

export default ChatContainer