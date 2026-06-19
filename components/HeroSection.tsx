import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: "2",
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: "3",
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

export default function HeroSection() {
  return (
    <section className="wrapper mt-20">
      <div className="library-hero-card rounded-[14px] bg-[#f3e4c7] px-7 py-8 sm:px-9 md:px-12 lg:px-9 lg:py-10 mt-5">
        <div className="grid items-center gap-7 lg:grid-cols-[1fr_1.2fr_0.9fr]">
          <div className="space-y-5 text-center lg:text-left">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl font-semibold leading-tight text-black md:text-4xl">
                Your Library
              </h1>
              <p className="mx-auto max-w-[420px] text-base leading-7 text-[#6c6862] lg:mx-0">
                Convert your books into interactive AI conversations. Listen,
                learn, and discuss your favorite reads.
              </p>
            </div>

            <Button
              variant="secondary"
              className="h-auto rounded-[10px] bg-white px-7 py-3 font-serif text-lg font-semibold text-[#222c37] shadow-none hover:bg-white/90"
            >
              <Link href="/books/new">
                <span className="size-5 text-2xl"> + </span>
                Add new book
              </Link>
            </Button>
          </div>

          <div className="flex justify-center">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books, an open book, a globe, and a reading lamp"
              width={491}
              height={352}
              priority
              className="h-auto w-full max-w-[390px] object-contain lg:max-w-[450px]"
            />
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[250px] rounded-[10px] bg-white px-4 py-5">
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#77736d] text-sm font-medium text-[#222c37]">
                      {step.number}
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-base font-semibold leading-none text-[#222c37]">
                        {step.title}
                      </h2>
                      <p className="text-sm leading-5 text-[#6c6862]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
