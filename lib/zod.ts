import { z } from "zod"

const MAX_PDF_SIZE = 50 * 1024 * 1024

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File

const pdfSchema = z
  .custom<File>(isFile, "Please select a PDF file")
  .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
  .refine(
    (file) => file.size <= MAX_PDF_SIZE,
    "PDF file must be 50MB or smaller"
  )

const coverSchema = z
  .custom<File>(isFile, "Please select an image file")
  .refine((file) => file.type.startsWith("image/"), "Only image files are allowed")
  .optional()

export const UploadSchema = z.object({
  pdf: pdfSchema,
  cover: coverSchema,
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author name is required"),
  voice: z.enum(["dave", "daniel", "chris", "rachel", "sarah"], {
    error: "Please choose an assistant voice",
  }),
})

export type UploadFormValues = z.infer<typeof UploadSchema>
