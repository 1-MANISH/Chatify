
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UsersLoadingSkeleton'
import NoChatsFound from './NoChatsFound'
import { useAuthStore } from '../store/useAuthStore'
const ChatsList = () => {

        const {chats,isUsersLoading,getMyChatPartners,setSelectedUser} = useChatStore()
        const {onlineUsers} = useAuthStore()// to get online users

        useEffect(()=>{
                const fetchData = async () => {
                       try {
                                await getMyChatPartners()
                       } catch (error) {
                               console.log(`Error getting all chats: ${error}`)
                       }
                };
                fetchData();
        },[getMyChatPartners])

        if(isUsersLoading){
                return <UsersLoadingSkeleton />
        }
        if(chats.length === 0){
                return <NoChatsFound />
        }
        return (
                <>
                        {
                                chats.map((chat,_index)=>{

                                        const isOnline = onlineUsers?.includes(chat._id.toString())
                                        
                                        return <div
                                                key={chat?._id}
                                                className='"bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
                                                onClick={()=>setSelectedUser(chat)}
                                        >
                                                <div className="flex items-center gap-3">
                                                        {/* TODO:fix with online users - web sockets */}
                                                        <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                                                                <div className="size-12 rounded-full">
                                                                        <img src={chat?.profilePicture || "/avatar.png"} alt={chat?.fullName} />
                                                                </div>
                                                                </div>
                                                                <h4 className="text-slate-200 font-medium truncate text-sm">{chat?.fullName?.toUpperCase()}</h4>
                                                        </div>

                                        </div>
                                })
                        }
                </>
        )
}

export default ChatsList