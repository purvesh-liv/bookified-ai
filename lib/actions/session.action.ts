"use server"

import VoiceSession from "@/database/models/voice-session.model"
import { connectToDatabase } from "@/database/mongoose"
import { EndSessionResult, StartSessionResult } from "@/types"
import { getCurrentRouteCacheVersion } from "next/dist/client/components/segment-cache/cache"
import { getCurrentBillingPeriodStart } from "../subscriptions-constants"



export const startVoiceSession = async (clerkId:string,bookId:string):Promise<StartSessionResult> =>{
    try {
        await connectToDatabase()

        //limits and plans to see whether a session is allowed

        const session = await VoiceSession.create({
            clerkId, bookId,startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds:0,
        })
        return{
            success:true,
            sessionId:session._id.toString(),
            //maxduration
        }
    } catch (error) {
        console.error('Error connecting to voice session',error)
        return{
            success:false,
            error:"failed to start voive session, try again later"
        }
    }
}

export const endVoiceSession = async (
    sessionId: string,
    durationSeconds: number,
): Promise<EndSessionResult> => {
    try {
        await connectToDatabase()

        const session = await VoiceSession.findByIdAndUpdate(
            sessionId,
            {
                endedAt: new Date(),
                durationSeconds,
            },
            { new: true },
        )

        if (!session) {
            return {
                success: false,
                error: "voice session not found",
            }
        }

        return {
            success: true,
        }
    } catch (error) {
        console.error("Error ending voice session", error)
        return {
            success: false,
            error: "failed to end voice session, try again later",
        }
    }
}
