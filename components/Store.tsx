"use client"

import { useState } from "react"

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
        Analyzing your store...
      </div>
    </div>
  )
}

export default function Store() {
  const [url, setUrl] = useState("")
  const [desc, setDesc] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!desc.trim()) {
      setError("Please describe your store.")
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const prompt = `Analyze this Whop store:

URL: ${url || "not provided"}
Description: ${desc}

Provide:

**OVERALL SCORE: X/100**
One-line verdict.

**TOP 3 REVENUE LEAKS**
For each: Problem, Impact, Exact Fix, Est. Revenue Recovery

**QUICK WINS (this week)**
3 specific things doable in under 2 hours.

**OFFER REVIEW**
Positioning, price, what is missing.

**GROWTH POTENTIAL**
Est. monthly revenue increase if all issues are fixed.

Next step: The single most important thing to do today.`

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
          Store Analyzer
        </div>
        <div className="text-sm text-muted-foreground mb-5 font-light">
          Instant AI revenue diagnosis for your Whop store.
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Whop Store URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="whop.com/your-store"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-5">
          <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
            Describe Your Store
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={8}
            placeholder="What do you sell? Who is your audience? Price? Conversion rate? Current problems?"
            className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground resize-y min-h-[140px]"
          />
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
          {loading ? "Analyzing..." : "Analyze Store"}
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
                Analysis Results
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-sm">Describe your store to get analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}
