import {Resend} from 'resend';
import { ENV } from './env.js';

const apiKey  =  ENV.RESEND_API_KEY

export const resendClient = new Resend(apiKey)

export const sender = {
        name:ENV.EMAIL_FROM_NAME,
        email:ENV.EMAIL_FROM
}