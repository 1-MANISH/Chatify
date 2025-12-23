
import arcjetInstance from "../lib/arcjet.js"
import {isSpoofedBot} from "@arcjet/inspect";

export const arcjetProtection = async (req,res,next) => {

        try {
                
                const decision = await arcjetInstance.protect(req)
                if(decision.isDenied()){
                        if(decision.reason.isRateLimit()){
                                return res.status(429).json({message:"Too many requests. Please try again later."});
                        }
                        else if(decision.reason.isBot()){
                                return res.status(403).json({message:"Access denied. You are a bot."});
                        }else{
                                return res.status(403).json({
                                        message:"Access denied by security policy."
                                })
                        }
                }
                // Optional: Further inspect allowed requests for spoofed bots
                if(decision.results.some(isSpoofedBot)){
                        return res.status(403).json({
                                error:'Access denied. Spoofed bot detected.',
                                message:"Malicious bot activity detected."
                        })
                }

                next()
        } catch (error) {
                console.log(`Arcjet Protection Error: ${error}`);
                next();
        }
}