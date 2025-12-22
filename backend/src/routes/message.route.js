import { Router } from "express";
import { getAllContacts, getChatsPartner, getMessageByUserId ,sendMessageToUser} from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection,protectedRoute)

router.get('/contacts',getAllContacts)
router.get('/chats/partner',getChatsPartner)
router.get('/:id',getMessageByUserId) // me and userId - b/w us 
router.post('/send/:id',sendMessageToUser) // me and userId

export default router;