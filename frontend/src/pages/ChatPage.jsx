
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {

        const {logout} = useAuthStore()
        return (
                <div className='z-10000' >
                        <button onClick={logout}>
                                <span onClick={logout}>Logout</span>
                        </button>
                </div>
        )
}

export default ChatPage