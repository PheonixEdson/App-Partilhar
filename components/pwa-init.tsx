"use client"

import { useEffect } from "react"

export function PWAInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[v0] Service Worker registered:", registration.scope)
          })
          .catch((error) => {
            console.log("[v0] Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  return null
}
