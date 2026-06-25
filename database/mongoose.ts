import mongoose from "mongoose";
declare global{
    var mongooseCache:{
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose > | null
    }
}

const cached = global.mongooseCache || (global.mongooseCache = {conn:null, promise:null})

export const connectToDatabase = async()=>{
    const MONGODB_URI = process.env.MONGODB_URI;

    if(!MONGODB_URI){
        throw new Error("please define the MONGODB_URI env variable")
    }

    if(cached.conn) return cached.conn

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI,{
              bufferCommands:false
        })
    }
    try {
         cached.conn = await cached.promise;
         
    } catch (error) {
          cached.promise = null
          console.error("monogodb connection error")
          throw error;
    }
    console.info("connected to Mongodb");
    return cached.conn
    
    }
