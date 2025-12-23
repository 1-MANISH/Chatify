import  { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UsersLoadingSkeleton'
import { useAuthStore } from '../store/useAuthStore'

const ContactsList = () => {

        const {allContacts,isUsersLoading,getAllContacts,setSelectedUser} = useChatStore()
        const {onlineUsers} = useAuthStore()// to get online users

        useEffect(()=>{
                const fetchData = async () => {
                       try {
                                await getAllContacts()
                       } catch (error) {
                               console.log(`Error getting all contacts: ${error}`)
                       }
                }
                fetchData();
        },[getAllContacts])

        if(isUsersLoading){
                return <UsersLoadingSkeleton />
        }

        return (
                <>
                {
                        allContacts.map((contact) => (
                                <div
                                        key={contact?._id}
                                        className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                                        onClick={() => setSelectedUser(contact)}
                                >
                                <div className="flex items-center gap-3">
                                          {/* TODO:fix with online users - web sockets */}
                                        <div className={`avatar avatar-online`}>
                                                <div className="size-12 rounded-full">
                                                        <img src={contact?.profilePicture || "/avatar.png"} />
                                                </div>
                                        </div>
                                        <h4 className="text-slate-200 font-medium text-sm">{contact?.fullName?.toUpperCase()}</h4>
                                        </div>
                                </div>
                        ))
                }
                </>
        )
}

export default ContactsList