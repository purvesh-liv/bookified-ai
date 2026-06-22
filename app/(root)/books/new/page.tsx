import React from 'react'
import UploadForm from '@/components/UploadForm'

const page = () => {
  return (
    <main className="wrapper container ">
      <div className="mx-auto max-w-180 space-y-180">
        <section className="flex flex-col gap-5">
          <h1 className="page-title-xl">Add new book</h1>
          <p className="subtitle">
            Upload a PDF to generate your intereactive Reading experience
          </p>
          <UploadForm />
        </section>
      </div>
    </main>
  );
}

export default page
