"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("sellr_user")
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-dvh bg-hero flex items-center justify-center">
      <div className="w-9 h-9 border-[3px] border-card/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
}
