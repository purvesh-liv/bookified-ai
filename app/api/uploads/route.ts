
import { MAX_FILE_SIZE } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
     const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async ()=>{
        const {userId} = await auth();

        if(!userId){
            throw new Error('unauthorized user not authenticated')
        }
        return {
            allowedContentTypes:['application/pdf','image/jpeg','image/png','image/webp'],
            addRandomSuffix:true,
            maximumSizeInBytes: MAX_FILE_SIZE,
            tokenPayload: JSON.stringify({userId})
        }}, 
      onUploadCompleted: async ({blob,tokenPayload}) =>{
        console.log('file uploaded to blob:', blob.url);

        const payload = tokenPayload ? JSON.parse(tokenPayload):null
        const userId = payload?.userId;

        // todo : posthog

        
      }
    
    })
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unkown error occured";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
  )}
}