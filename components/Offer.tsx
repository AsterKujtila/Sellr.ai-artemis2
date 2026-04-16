"use client"

import { useState } from "react"

const STYLES = ["bold", "soft", "urgency", "story"] as const

function LoadingDots() {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary animate-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="text-sm text-muted-foreground italic">
        Writing your offer...
      </div>
    </div>
  )
}

export default function Offer() {
  const [style, setStyle] = useState<(typeof STYLES)[number]>("bold")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [product, setProduct] = useState("")
  const [audience, setAudience] = useState("")
  const [outcome, setOutcome] = useState("")
  const [price, setPrice] = useState("")

  const run = async () => {
    if (!product.trim()) {
      setError("Product name is required.")
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const prompt = `Write a complete high-converting Whop offer page:

Product: ${product}
Audience: ${audience || "not specified"}
Outcome: ${outcome || "not specified"}
Price: ${price || "not specified"}
Style: ${style}

Provide:

**HEADLINE** (under 10 words)

**SUBHEADLINE** (1 sentence)

**BULLET POINTS** (5x starting with checkmark)

**CTA BUTTON** (under 6 words)

**TRUST LINE** (guarantee or social proof)

---
**CRITIQUE:** What is strongest, and best A/B test to run first.`

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Error")
      setResult(data.text)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,320px)_1fr] gap-4 h-full">
      {/* Form Panel */}
      <div className="bg-card rounded-2xl border border-border p-5 overflow-y-auto">
        <div className="font-serif font-bold text-xl text-foreground mb-1">
          Offer Builder
        </div>
        <div className="text-sm text-muted-foreground mb-5 font-light">
          SELLR writes your complete offer copy.
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Product / Service
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. Fitness coaching community"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Target Audience
          </label>
          <textarea
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            rows={2}
            placeholder="e.g. Online coaches under $5k/mo"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground resize-y min-h-[72px]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Main Outcome
          </label>
          <input
            type="text"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g. Double monthly revenue"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Price
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. $97/mo"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-5">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-2 uppercase tracking-wider">
            Tone / Style
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 cursor-pointer border ${
                  style === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            onClick={() => setError(null)}
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4 cursor-pointer"
          >
            {error}
          </div>
        )}

        <button
          onClick={run}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-foreground text-card font-semibold text-base cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Offer Copy"}
        </button>
      </div>

      {/* Result Panel */}
      <div className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden min-h-[400px]">
        {loading ? (
          <LoadingDots />
        ) : result ? (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                Generated Offer
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-foreground cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground border border-border"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3 text-muted-foreground">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <p className="text-sm">Fill in the form to generate your offer</p>
          </div>
        )}
      </div>
    </div>
  )
}
