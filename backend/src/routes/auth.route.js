import { Router } from "express";

const router = Router();


router.get('/login',(req,res)=>{
        res.send('Login Route');
})
router.get('/signup',(req,res)=>{
        res.send('Signup Route');
})
router.get('/logout',(req,res)=>{
        res.send('Logout Route');
})


export default router;