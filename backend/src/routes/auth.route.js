import { Router } from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection)

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.put('/update-profile',protectedRoute,updateProfile)


router.get('/check',protectedRoute,(req,res)=>{
        return res.status(200).json({user:req.user})
})

export default router;