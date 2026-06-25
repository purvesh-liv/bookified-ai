"use server"
import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { success } from "zod";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { log } from "console";
import { create } from "domain";


// server actions

//check if book exists
export const checkBookExists= async(title:string)=>{
   try {
     await connectToDatabase();

     const slug = generateSlug(title);

     const existingBook = await Book.findOne({slug}).lean()

     if(existingBook){
        return{
            exists:true,
            book:serializeData(existingBook)
        }
     }
     return{
        exists:false
     }
   } catch (error) {
    console.error("eror chcecking book exists",error);
    return{
        exists:false,
        error:error

    }
    
   }
}
// create book if it did not exist
export const createBook = async(data:CreateBook) =>{
   try {
      await connectToDatabase();

      const slug = generateSlug(data.title);

      const existingBook = await Book.findOne({slug}).lean()

      if(existingBook){
        return {
            success:true,
            data: serializeData((existingBook)),
            alreadyExists: true,
        }
      }
      //check subscription limits || todo

      const book = await Book.create({...data, slug, totalSegments:0})

      return{
        success:true,
        data:serializeData(book)
      }
   } catch (error) {
      console.error("Error creating a book", error)

      return{
        success:false,
        error:error
      }
   }
} 

// save the segments 
export const saveBookSegments = async(bookId:string,clerkid:string,segments:TextSegment[])=>{

    try {
        await connectToDatabase();

        console.log("saving book segments....");

        const segmentsToInsert = segments.map(({text , segmentIndex, pageNumber,wordCount})=>({
            clerkId: clerkid, bookId, content:text, segmentIndex, pageNumber,wordCount
        }))
        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId,{totalsegments:segments.length})
        console.log("book segments saved succesfully");
        
        return{
            success:true,
            data:{segmentsCreated:segments.length}
        }
        
    } catch (error) {
        console.error("error saving book segments", error)

        await BookSegment.deleteMany({bookId});
        await Book.findByIdAndDelete(bookId);
        console.log("Deleted book segments and book due to failure to save segmnts")
        return{
            success:false,
            error:error
        }
    }
}

export const getAllBooks = async()=>{
       try {
         await connectToDatabase()

         const books = await Book.find().sort({createdAt:-1}).lean()

         return{
            success:true,
            data:serializeData(books)
         }
       } catch (error) {
            console.error("error connecting to db")
            return{
                success:false,
                error:error
            }
       }
}