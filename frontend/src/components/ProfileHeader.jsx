import {useState,useRef} from 'react'
import {LogOutIcon,VolumeOffIcon,Volume2Icon} from "lucide-react"
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const mouseClickSound = new Audio('./sounds/mouse-click.mp3')

const ProfileHeader = () => {

        const {logout,authUser,updateProfile} = useAuthStore()
        const {isSoundEnabled,toggleSound} = useChatStore()
        const[selectedImage,setSelectedImage] = useState(null)

        const fileInputRef = useRef(null)

        const handleImageUpload = async (e)=>{
                e.preventDefault()
                try {
                        const file = e.target.files[0]
                        if(!file) return

                        const reader = new FileReader()
                        reader.readAsDataURL(file)

                        reader.onloadend = async()=>{
                                if(reader.readyState === 2){
                                         const base64Image = reader.result
                                        setSelectedImage(base64Image)
                                        await updateProfile(base64Image)
                                }else {
                                        setSelectedImage(null)
                                }
                        }

                } catch (error) {
                        console.log(`Error uploading image: ${error}`)
                }
        }

        const logoutHandler = async() =>{
                try {
                        await logout()
                } catch (error) {
                        console.log(`Error logging out: ${error}`)
                }
        }

        const toggleSoundHandler = () =>{
               try {
                        mouseClickSound.currentTime = 0;
                        mouseClickSound.play().catch(err=>{
                                console.log(`Error playing sound: ${err}`)
                        })
                        toggleSound()
               } catch (error) {
                        console.log(`Error toggling sound: ${error}`)
               }
        }

        return (
                <div className='p-6 border-b border-slate-700/50'>

                        <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                        {/* AVATAR */}
                                        <div className="avatar avatar-online">
                                                <button 
                                                        className='size-14 rounded-full overflow-hidden relative group'
                                                        onClick={()=>fileInputRef.current.click()}
                                                >
                                                        <img 
                                                                src={selectedImage || authUser?.profilePicture || "./avatar.png"} 
                                                                alt="User image" 
                                                                className='size-full object-cover'
                                                        />
                                                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <span className="text-white text-xs">Change</span>
                                                        </div>

                                                </button>
                                                
                                                <input 
                                                        type="file" 
                                                        accept='image/*'
                                                        className='hidden'
                                                        ref={fileInputRef}
                                                        onChange={handleImageUpload}
                                                />
                                        </div>
                                        {/* USER NAME and ONLINE TEXT */}
                                        <div className="">
                                                <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser?.fullName?.toUpperCase()}</h3>
                                                <p className="text-slate-400 text-xs">Online</p>
                                        </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                        <button 
                                                className='text-slate-400 hover:text-slate-200 transition-colors'
                                                onClick={logoutHandler}
                                        >
                                                <LogOutIcon className="w-6 h-6"  />
                                        </button>

                                        <button
                                                className='text-slate-400 hover:text-slate-200 transition-colors'
                                                onClick={toggleSoundHandler}
                                        >
                                                {
                                                        isSoundEnabled ? 
                                                        <Volume2Icon className='size-5' /> :
                                                         <VolumeOffIcon className='size-5' />
                                                }
                                        </button>

                                </div>
                        </div>
                        

                </div>
        )
}

export default ProfileHeader