"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false })
const Offer = dynamic(() => import("@/components/Offer"), { ssr: false })
const Store = dynamic(() => import("@/components/Store"), { ssr: false })

type NavItem = "dashboard" | "chat" | "offers" | "store" | "credits"

interface User {
  name: string
  email: string
  id: string
}

const NAV_ITEMS: { id: NavItem; icon: React.ReactNode; label: string }[] = [
  {
    id: "dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    label: "Dashboard",
  },
  {
    id: "chat",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "AI Chat",
  },
  {
    id: "offers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    label: "Offer Builder",
  },
  {
    id: "store",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    label: "Store Analyzer",
  },
  {
    id: "credits",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    label: "Credits",
  },
]

const KPIS = [
  { label: "Revenue (7d)", value: "$4,280", trend: "+12.4%", data: [45, 33, 55, 79, 67, 90, 100] },
  { label: "Orders", value: "847", trend: "+8.1%", data: [60, 45, 70, 80, 75, 88, 95] },
  { label: "Conversion", value: "3.8%", trend: "+0.4%", data: [30, 28, 35, 38, 36, 40, 42] },
  { label: "Store Score", value: "82/100", trend: "+5pts", data: [65, 68, 70, 74, 77, 80, 82] },
]

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`)
    .join(" ")

  return (
    <svg viewBox="0 0 100 100" className="w-full h-10" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Credits() {
  const plans = [
    {
      name: "Starter",
      price: 19,
      credits: 200,
      features: ["Store Analyzer", "Offer Builder", "AI Chat", "A/B Tester", "Credits never expire"],
      popular: false,
    },
    {
      name: "Pro",
      price: 49,
      credits: 600,
      features: ["Everything in Starter", "Launch Builder", "Unlimited history", "Priority support", "Early access"],
      popular: true,
    },
    {
      name: "Scale",
      price: 99,
      credits: 1500,
      features: ["Everything in Pro", "Founder access", "PDF exports", "Custom integrations", "1:1 onboarding"],
      popular: false,
    },
  ]

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="font-serif font-bold text-xl text-foreground mb-1">
          Credits & Billing
        </div>
        <div className="text-sm text-muted-foreground mb-4 font-light">
          Credits power all AI features and never expire.
        </div>

        <div className="flex items-center gap-5 flex-wrap mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Credits remaining</div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-black text-5xl text-primary">18</span>
              <span className="text-sm text-muted-foreground">/ 20</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-3 text-sm text-secondary-foreground">
          <strong className="text-foreground">Credit costs:</strong> AI Chat = 1 | Offer Builder = 2 | Store Analyzer = 3
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-5 border relative transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              plan.popular
                ? "bg-foreground text-card border-foreground/10"
                : "bg-card text-foreground border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider whitespace-nowrap">
                BEST VALUE
              </div>
            )}
            <div className={`text-sm font-medium mb-1 ${plan.popular ? "text-card/70" : "text-muted-foreground"}`}>
              {plan.name}
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-serif font-bold text-3xl">${plan.price}</span>
              <span className={`text-sm ${plan.popular ? "text-card/60" : "text-muted-foreground"}`}>/mo</span>
            </div>
            <div className={`text-sm font-medium mb-3 ${plan.popular ? "text-primary" : "text-primary"}`}>
              {plan.credits} credits
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.map((f) => (
                <li key={f} className={`text-xs flex items-start gap-2 ${plan.popular ? "text-card/80" : "text-muted-foreground"}`}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 mt-0.5 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-secondary text-foreground border border-border hover:border-primary"
              }`}
            >
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card rounded-2xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif font-bold text-2xl text-foreground">{kpi.value}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                {kpi.trend}
              </span>
            </div>
            <MiniChart data={kpi.data} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="font-serif font-bold text-lg text-foreground mb-4">Quick Actions</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-foreground text-sm">Start AI Chat</div>
              <div className="text-xs text-muted-foreground">Get sales advice</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-foreground text-sm">Build Offer</div>
              <div className="text-xs text-muted-foreground">Generate copy</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-foreground text-sm">Analyze Store</div>
              <div className="text-xs text-muted-foreground">Find revenue leaks</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="font-serif font-bold text-lg text-foreground mb-4">Recent Activity</div>
        <div className="space-y-3">
          {[
            { action: "Store analyzed", time: "2 hours ago", credits: -3 },
            { action: "Offer generated", time: "Yesterday", credits: -2 },
            { action: "AI Chat session", time: "Yesterday", credits: -1 },
            { action: "Credits purchased", time: "3 days ago", credits: 20 },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-foreground">{item.action}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
              <div
                className={`text-sm font-medium ${
                  item.credits > 0 ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {item.credits > 0 ? "+" : ""}
                {item.credits} credits
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard")
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sellr_user")
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("sellr_user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-border border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeNav) {
      case "chat":
        return <Chat name={user.name} />
      case "offers":
        return <Offer />
      case "store":
        return <Store />
      case "credits":
        return <Credits />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="font-sans font-bold text-lg text-foreground">
          sellr<span className="text-primary font-light">.ai</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-dvh w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="font-sans font-bold text-xl text-foreground">
            sellr<span className="text-primary font-light">.ai</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">AI Sales Coach</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeNav === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-secondary text-sm font-medium text-foreground cursor-pointer transition-all duration-200 hover:bg-destructive/10 hover:text-destructive border border-border"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-dvh lg:min-h-0 pt-14 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h1 className="font-serif font-bold text-2xl text-foreground">
              {NAV_ITEMS.find((i) => i.id === activeNav)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeNav === "dashboard" && "Overview of your sales performance"}
              {activeNav === "chat" && "Get AI-powered sales coaching"}
              {activeNav === "offers" && "Generate high-converting offer copy"}
              {activeNav === "store" && "Analyze and optimize your store"}
              {activeNav === "credits" && "Manage your credits and subscription"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
              18 credits
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
