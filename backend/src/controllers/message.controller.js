import {Message} from '../models/message.model.js';
import {User} from '../models/user.model.js';
import cloudinary from "../lib/cloudinary.js"

export const getAllContacts  =  async(req,res)=> {
        try {

                const loggedInUserId = req.user._id;

                const contacts = await User.find({
                        _id: { $ne: loggedInUserId }
                }).select('-password');


                res.status(200).json({
                        message:'Contacts fetched successfully',
                        contacts
                });
        } catch (error) {
                console.error('Error in getAllContacts:', error);
                res.status(500).json({message:'Internal Server Error'});
        }
}

export const getChatsPartner = async(req,res)=>{
        try {

                const loggedInUserId = req.user._id;

                const messages =  await Message.find({
                        $or:[
                                {senderId:loggedInUserId},
                                {receiverId:loggedInUserId}
                        ]
                })

                const partnersIds = new Set();
                messages.forEach(msg=>
                        msg.senderId.toString() === loggedInUserId.toString() ?
                        partnersIds.add(msg.receiverId.toString()):
                        partnersIds.add(msg.senderId.toString()) 
                )

                const chatPartners = await User.find({
                        _id:{$in:Array.from(partnersIds)}
                }).select('-password');

                res.status(200).json({
                        message:'Message sent successfully',
                        chatPartners
                });
                
        } catch (error) {
                console.error('Error in sendMessage:', error);
                res.status(500).json({message:'Internal Server Error'});
        }
}
export const getMessageByUserId = async(req,res)=>{
        try {

                const myId = req.user._id;
                const userId = req.params.id;
              
                const messages = await Message.find({
                        $or:[
                                {senderId:myId,receiverId:userId},
                                {senderId:userId,receiverId:myId}
                        ]
                })
                
                res.status(200).json({
                        message:'Messages fetched successfully',
                        messages
                });
                
        } catch (error) {
                console.error('Error in getMessageByUserId:', error);
                res.status(500).json({message:'Internal Server Error'});
        }
}

export const sendMessageToUser = async (req,res)=>{
        try {

                const myId = req.user._id;
                const userId = req.params.id;
                const {text,image} = req.body;

                if(!text && !image){
                        return res.status(400).json({message:'Message content is required'});
                }

                if(userId.toString() === myId.toString()){
                        return res.status(400).json({message:'You cannot send message to yourself'});
                }

                const receiverExists = await User.findById(userId);
                if(!receiverExists){
                        return res.status(404).json({message:'Recipient user not found'});
                }

                let imgUrl;
                if(image){
                        const uploadResult = await cloudinary.uploader.upload(
                                image,
                                {
                                        folder:'chatify'
                                }
                        )
                        imgUrl = uploadResult.secure_url;
                }

                const newMessage = await Message.create({
                        senderId:myId,
                        receiverId:userId,
                        text:text || '',
                        image:imgUrl || ''
                })

                // socket implementation can be added here
                // send notification to receiver using sockets - if user is online

                res.status(201).json({
                        message:'Message sent successfully',
                        newMessage
                });
                
        } catch (error) {
                console.error('Error in sendMessageToUser:', error);
                res.status(500).json({message:'Internal Server Error'});
        }
}