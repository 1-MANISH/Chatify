import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {ENV} from "../lib/env.js";

export const signup = async(req,res) => {

        try {
                const {fullName,email,password} = req.body

                if(!fullName || !email || !password) {
                        return res.status(400).json({message: 'All fields are required'});
                }

                if(password.length < 6){
                        return res.status(400).json({message: 'Password must be at least 6 characters long'});
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                        return res.status(400).json({ message: 'Invalid email format' });
                }

                const user = await User.findOne({email});
                if(user){
                        return res.status(400).json({message: 'Email already in use'});
                }

                const hashedPassword = await bcrypt.hash(password,10);

                const newUser =await User.create({
                        fullName,
                        email,
                        password:hashedPassword,
                })

                // tokens and cookies 
                generateToken(newUser._id,res) // cookie set done here

                res.status(201).json({
                        message: 'User created successfully',
                        user:{
                                _id:newUser._id,
                                fullName:newUser.fullName,
                                email:newUser.email,
                                profilePicture:newUser.profilePicture,
                        }
                })

                // also we can send welcome email here

                try {
                        await sendWelcomeEmail(
                                newUser.email,
                                newUser.fullName,
                                ENV.CLIENT_URL
                        )
                } catch (error) {
                        console.log(`Error sending welcome email: ${error.message}`);
                }

        } catch (error) {
                console.error('Error in signup:', error.message);
                return res.status(500).json({ message: 'Internal Server Error' });
        }
       
}
export const login = async(req,res) => {
        res.send('Login Route');
}
export const logout = async(req,res) => {
        res.send('Logout Route');
}

/*

status code - 

400 - Bad Request (for validation errors)
500 - Internal Server Error
201 - Created (for successful user creation)

*/