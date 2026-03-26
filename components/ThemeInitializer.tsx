"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    let theme = "light"
    let accentColor = "#7C3AED"
    let language = "en"
    
    try {
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        theme = parsed.theme || "light"
        accentColor = parsed.accentColor || "#7C3AED"
        language = parsed.language || "en"
      }
    } catch (e) {
      console.error("Failed to parse theme settings", e)
    }
    
    document.documentElement.style.setProperty("--accent", accentColor)
    document.documentElement.lang = language
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    } else if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.add("light")
      }
    }
  }, [])

  return null
}
