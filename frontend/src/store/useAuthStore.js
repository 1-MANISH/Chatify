import {create} from 'zustand';


export const useAuthStore = create((set)=>({
        authUser:{
                name:'john',
                _id:'12345',
                age:30
        },
        isLoggedIn:false,
        isLoading:false,

        login:()=>{
                console.log("We are logging in");
                set({isLoggedIn:true})
        }
}))