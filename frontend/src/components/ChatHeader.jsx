import { XIcon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react"


const ChatHeader = () => {

        const {selectedUser,setSelectedUser} = useChatStore()
        const {onlineUsers} = useAuthStore()
        // TODO : Check if user is online
        const isOnline = true

        // online of escape we want selected user to be null
        useEffect(()=>{
                const handleEscKeyPress = (event) =>{
                        if(event.key === "Escape"){
                                // console.log("Escape key pressed")
                                setSelectedUser(null)
                        }
                }
                window.addEventListener("keydown",handleEscKeyPress)
                return () => {
                        // console.log('called clean up')
                        window.removeEventListener("keydown",handleEscKeyPress)
                }
        },[setSelectedUser])

        return (
               <div
                className="flex justify-between items-center bg-slate-800/50 border-b
                border-slate-700/50 max-h-[84px] px-6 flex-1"
                >
                        <div className="flex items-center space-x-3">
                                <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                                        <div className="w-12 rounded-full">
                                                <img src={selectedUser?.profilePicture || "/avatar.png"} alt={selectedUser?.fullName} />
                                        </div>
                                </div>

                                <div>
                                        <h3 className="text-slate-200 font-medium">{selectedUser?.fullName?.toUpperCase()}</h3>
                                        <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
                                </div>
                        </div>

                        <button onClick={() => setSelectedUser(null)}>
                                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
                        </button>
                </div>
        )
}

export default ChatHeader