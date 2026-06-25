"use client"

import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"

import LoadingOverlay from "@/components/LoadingOverlay"
import Voiceselecter from "@/components/Voiceselecter"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn, parsePDFFile } from "@/lib/utils"
import { UploadSchema, type UploadFormValues } from "@/lib/zod"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { checkBookExists, createBook, saveBookSegments } from "@/lib/actions/book.actions"
import { exists } from "fs"
import { useRouter } from "next/navigation";
import {upload, uploadPart} from "@vercel/blob/client"
import { error } from "console"


const UploadForm = () => {
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const {userId} = useAuth()
  const router = useRouter()

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona:'',
      pdfFile:undefined,
      coverImage:undefined,
      
    },
  })

  const onSubmit = async (data:UploadFormValues) => {
    if(!userId){
     return toast.error("please login to upload books")
    }
    // posthog -> track book uploads..
    try {
       const existCheck = await checkBookExists(data.title)
       if(existCheck.exists && existCheck.book){
         toast.error("book with the same title already exist . ")
        form.reset()
        router.push(`/books/${existCheck.book.slug}`)
        return
       }
        // parsing the pdf
       const fileTitle = data.title.replace(/\s+/g,'-').toLowerCase();
       const pdfFile = data.pdfFile
 
       const parsedPDF = await parsePDFFile(pdfFile)
       if(parsedPDF.content.length ===0){
        toast.error("failed to parse pdf. please try again wiht a different file")
        return;
       }
      // uploading the pdf to vercel blob
       const uploadedPdfBlob = await upload(fileTitle,pdfFile,{
        access:'public',
        handleUploadUrl:'/api/uploads',
        contentType:'application/pdf'
       });

       let coverUrl:string;

       if(data.coverImage){
        const coverFile = data.coverImage;
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`,coverFile,{
          access:'public',
          handleUploadUrl:'/api/uploads',
          contentType:coverFile.type
        })
        coverUrl = uploadedCoverBlob.url;
       }else{
        const response = await fetch(parsedPDF.cover)
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}`, blob, {
          access: "public",
          handleUploadUrl: "/api/uploads",
          contentType: "image/png",
        });
        coverUrl = uploadedCoverBlob.url;
       }

       const book = await createBook({
        clerkId:userId,
        title:data.title,
        author:data.author,
        persona:data.persona,
        fileURL:uploadedPdfBlob.url,
        fileBlobKey:uploadedPdfBlob.pathname,
        coverURL:coverUrl,
        fileSize:pdfFile.size
       });
       if(!book.success) throw new Error("Failed to create book")
      
        if (book.alreadyExists) {
          toast.error("book with the same title already exist . ");
          form.reset();
          router.push(`/books/${existCheck.book.slug}`);
          return;
        }
        // if the book doesnt already exists then save the segments
        const segments = await saveBookSegments(book.data._id,userId,parsedPDF.content)

        if(!segments?.success){
          toast.error("failed to save book segments")
             throw new Error("failed to save book segments");
        } 
        form.reset()
        router.push('/')
    } catch (error) {
      console.error(error)
      toast.error("failed to upload book. please try again later")
    }
  }

  return (
    <div className="new-book-wrapper">
      <LoadingOverlay isLoading={form.formState.isSubmitting} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Book PDF File</FormLabel>
                <div
                  className={cn(
                    "upload-dropzone relative border-2 border-dashed border-[#c9bda8]",
                    field.value && "upload-dropzone-uploaded"
                  )}
                >
                  <FormControl>
                    <input
                      ref={(element) => {
                        field.ref(element)
                        pdfInputRef.current = element
                      }}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(event.target.files?.[0])
                      }
                    />
                  </FormControl>

                  <Upload className="upload-dropzone-icon" aria-hidden="true" />
                  <p className="upload-dropzone-text">
                    {field.value ? field.value.name : "Click to upload PDF"}
                  </p>
                  <p className="upload-dropzone-hint">
                    {field.value ? "PDF selected" : "PDF file (max 50MB)"}
                  </p>

                  {field.value && (
                    <button
                      type="button"
                      className="upload-dropzone-remove absolute top-4 right-4 z-20"
                      aria-label={`Remove ${field.value.name}`}
                      onClick={() => {
                        field.onChange(undefined)
                        if (pdfInputRef.current) pdfInputRef.current.value = ""
                      }}
                    >
                      <X aria-hidden="true" />
                    </button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">
                  Cover Image (Optional)
                </FormLabel>
                <div
                  className={cn(
                    "upload-dropzone relative border-2 border-dashed border-[#c9bda8]",
                    field.value && "upload-dropzone-uploaded"
                  )}
                >
                  <FormControl>
                    <input
                      ref={(element) => {
                        field.ref(element)
                        coverInputRef.current = element
                      }}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(event.target.files?.[0])
                      }
                    />
                  </FormControl>

                  <ImageIcon
                    className="upload-dropzone-icon"
                    aria-hidden="true"
                  />
                  <p className="upload-dropzone-text">
                    {field.value
                      ? field.value.name
                      : "Click to upload cover image"}
                  </p>
                  <p className="upload-dropzone-hint">
                    {field.value
                      ? "Cover image selected"
                      : "Leave empty to auto-generate from PDF"}
                  </p>

                  {field.value && (
                    <button
                      type="button"
                      className="upload-dropzone-remove absolute top-4 right-4 z-20"
                      aria-label={`Remove ${field.value.name}`}
                      onClick={() => {
                        field.onChange(undefined)
                        if (coverInputRef.current) coverInputRef.current.value = ""
                      }}
                    >
                      <X aria-hidden="true" />
                    </button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    className="form-input h-auto border-0 shadow-none focus-visible:ring-[#663820]/30"
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input
                    className="form-input h-auto border-0 shadow-none focus-visible:ring-[#663820]/30"
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">
                  Choose Assistant Voice
                </FormLabel>
                <FormControl>
                  <Voiceselecter
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-btn"
            disabled={form.formState.isSubmitting}
          >
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UploadForm
