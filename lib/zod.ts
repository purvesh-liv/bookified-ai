import { z } from "zod"
import {
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "./constants";
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
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name is too long"),
  persona: z.string().min(1, "Please select a voice"),
  pdfFile: z
    .instanceof(File, { message: "PDF file is required" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 50MB",
    )
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Only PDF files are accepted",
    ),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      "Image size must be less than 10MB",
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    ),
});

export type UploadFormValues = z.infer<typeof UploadSchema>
