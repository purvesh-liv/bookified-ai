import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getBookBySlug } from "@/lib/actions/book.actions";

export const dynamic = "force-dynamic";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;
  const coverSrc = book.coverURL || "/assets/book-cover.svg";

  return (
    <main className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="size-5 text-[#212a3b]" />
      </Link>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="vapi-header-card w-full">
          <div className="vapi-cover-wrapper">
            <Image
              src={coverSrc}
              alt={book.title}
              width={120}
              height={180}
              className="h-[180px] w-[120px] rounded-lg object-cover shadow-lg"
              priority
            />

            <div className="vapi-mic-wrapper">
              <button
                className="vapi-mic-btn"
                type="button"
                aria-label="Voice is off"
              >
                <MicOff className="size-8 text-[#212a3b]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold leading-tight text-[#212a3b] md:text-3xl">
                {book.title}
              </h1>
              <p className="mt-2 text-lg font-medium text-[#3d485e]">
                by {book.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">Voice: {book.persona}</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">0:00/15:00</span>
              </div>
            </div>
          </div>
        </section>

        <section className="transcript-container min-h-[400px]">
          <div className="transcript-empty">
            <Mic className="mb-6 size-12 text-[#212a3b]" />
            <p className="transcript-empty-text">No conversation yet</p>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
