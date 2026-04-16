"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }
    if (isSignUp && !name.trim()) {
      setError("Please enter your name")
      return
    }

    setLoading(true)

    // Store user in localStorage for demo purposes
    // In production, this would be a proper auth flow
    const userData = {
      email,
      name: isSignUp ? name : email.split("@")[0],
      id: email,
    }
    localStorage.setItem("sellr_user", JSON.stringify(userData))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  const handleDemoLogin = () => {
    const demoUser = {
      email: "demo@sellr.ai",
      name: "Demo User",
      id: "demo@sellr.ai",
    }
    localStorage.setItem("sellr_user", JSON.stringify(demoUser))
    router.push("/dashboard")
  }

  return (
    <div className="min-h-dvh bg-hero flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute -top-44 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, hsla(20, 55%, 53%, 0.12), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-40 w-[440px] h-[440px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, hsla(35, 20%, 94%, 0.05), transparent 70%)",
        }}
      />

      {/* Login Card */}
      <div className="bg-card rounded-3xl p-9 w-full max-w-[390px] shadow-2xl relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="font-sans font-bold text-2xl text-card-foreground mb-1.5">
          sellr<span className="text-primary font-light">.ai</span>
        </div>
        <p className="text-sm font-light text-muted-foreground mb-6">
          {isSignUp
            ? "Create your AI sales dashboard"
            : "Sign in to your AI sales dashboard"}
        </p>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        {/* Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base cursor-pointer transition-all duration-200 mb-4 hover:opacity-90 active:scale-[0.98]"
        >
          Try Demo (No Sign Up)
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-secondary-foreground mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-secondary border-[1.5px] border-border rounded-xl py-2.5 px-3.5 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-foreground text-card font-semibold text-base cursor-pointer transition-all duration-200 mt-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-card/30 border-t-card rounded-full animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </span>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError("")
            }}
            className="text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          AI sales coaching built for Whop sellers
        </p>
      </div>
    </div>
  )
}
