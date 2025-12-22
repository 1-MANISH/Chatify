import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"


export const sendWelcomeEmail = async(email,name,clientURL)=> {

        try {
                const {data,error} = await resendClient.emails.send({
                        from:`${sender.name} <${sender.email}>`,
                        to:email,
                        subject:"Welcome to Chatify!",
                        html:createWelcomeEmailTemplate(name,clientURL)
                })
                console.log('Welcome email sent:', data);
        } catch (error) {
                console.error('Error sending welcome email:', error);
                throw new Error('Failed to send welcome email');
        }
}