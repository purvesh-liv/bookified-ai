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
import { cn } from "@/lib/utils"
import { UploadSchema, type UploadFormValues } from "@/lib/zod"

const UploadForm = () => {
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: "rachel",
    },
  })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }

  return (
    <div className="new-book-wrapper">
      <LoadingOverlay isLoading={form.formState.isSubmitting} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pdf"
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
            name="cover"
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
            name="voice"
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
