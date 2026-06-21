"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface VoiceSelectorProps {
  value?: string
  onChange: (voiceId: string) => void
  disabled?: boolean
  className?: string
}

const maleVoices = [
  {
    id: "dave",
    name: "Dave",
    description: "Young male, British-Essex, casual & conversational",
  },
  {
    id: "daniel",
    name: "Daniel",
    description: "Middle-aged male, British, authoritative but warm",
  },
  {
    id: "chris",
    name: "Chris",
    description: "Male, casual & easy-going",
  },
] as const

const femaleVoices = [
  {
    id: "rachel",
    name: "Rachel",
    description: "Young female, American, calm & clear",
  },
  {
    id: "sarah",
    name: "Sarah",
    description: "Young female, American, soft & approachable",
  },
] as const

const Voiceselecter = ({
  value,
  onChange,
  disabled = false,
  className,
}: VoiceSelectorProps) => {
  const renderVoice = (voice: (typeof maleVoices)[number] | (typeof femaleVoices)[number]) => (
    <label
      key={voice.id}
      className={cn(
        "voice-selector-option",
        value === voice.id
          ? "voice-selector-option-selected"
          : "voice-selector-option-default",
        disabled && "voice-selector-option-disabled"
      )}
    >
      <RadioGroupItem value={voice.id} disabled={disabled} />
      <span className="min-w-0">
        <span className="block text-base font-semibold">{voice.name}</span>
        <span className="mt-1 block text-sm leading-5 text-[var(--text-secondary)]">
          {voice.description}
        </span>
      </span>
    </label>
  )

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className={cn("gap-6", className)}
    >
      <div className="space-y-3">
        <p className="text-base text-[var(--text-secondary)]">Male Voices</p>
        <div className="voice-selector-options flex-col md:flex-row">
          {maleVoices.map(renderVoice)}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-base text-[var(--text-secondary)]">
          Female Voices
        </p>
        <div className="voice-selector-options flex-col sm:flex-row">
          {femaleVoices.map(renderVoice)}
        </div>
      </div>
    </RadioGroup>
  )
}

export default Voiceselecter
