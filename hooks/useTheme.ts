"use client"

import { useState, useEffect, useCallback } from "react"

interface ThemeSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  language: string
  sidebarStyle: string
}

const defaultThemeSettings: ThemeSettings = {
  theme: "light",
  accentColor: "#7C3AED",
  language: "en",
  sidebarStyle: "default",
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "light"
}

export function useTheme() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  const applyThemeToDocument = useCallback((settings: ThemeSettings) => {
    const finalTheme = settings.theme === "system" ? getSystemTheme() : settings.theme
    
    // Apply accent color
    document.documentElement.style.setProperty("--accent", settings.accentColor)
    document.documentElement.style.setProperty("--primary", settings.accentColor)
    
    // Remove existing theme classes
    document.documentElement.classList.remove("dark", "light")
    document.body.classList.remove("dark", "light")
    
    // Add new theme class
    document.documentElement.classList.add(finalTheme)
    document.body.classList.add(finalTheme)

    if (settings.language) {
      document.documentElement.lang = settings.language
    }
    
    // Force a custom event to notify components of theme change
    window.dispatchEvent(new Event("theme-change"))
  }, [])

  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setThemeSettings({
          theme: parsed.theme || "light",
          accentColor: parsed.accentColor || "#7C3AED",
          language: parsed.language || "en",
          sidebarStyle: parsed.sidebarStyle || "default",
        })
        applyThemeToDocument({
          theme: parsed.theme || "light",
          accentColor: parsed.accentColor || "#7C3AED",
          language: parsed.language || "en",
          sidebarStyle: parsed.sidebarStyle || "default",
        })
      } catch (e) {
        console.error("Failed to parse theme settings", e)
        applyThemeToDocument(defaultThemeSettings)
      }
    } else {
      applyThemeToDocument(defaultThemeSettings)
    }
    setIsLoaded(true)
  }, [applyThemeToDocument])

  useEffect(() => {
    if (isLoaded) {
      applyThemeToDocument(themeSettings)
    }
  }, [themeSettings, isLoaded, applyThemeToDocument])

  const setTheme = (theme: "light" | "dark" | "system") => {
    setThemeSettings(prev => {
      const newSettings = { ...prev, theme }
      applyThemeToDocument(newSettings)
      return newSettings
    })
  }

  const setAccentColor = (accentColor: string) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev, accentColor }
      applyThemeToDocument(newSettings)
      return newSettings
    })
  }

  const setLanguage = (language: string) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev, language }
      applyThemeToDocument(newSettings)
      return newSettings
    })
  }

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(themeSettings))
  }

  const saveAndApply = () => {
    localStorage.setItem("userSettings", JSON.stringify(themeSettings))
    applyThemeToDocument(themeSettings)
  }

  return {
    themeSettings,
    setTheme,
    setAccentColor,
    setLanguage,
    applyTheme: applyThemeToDocument,
    saveSettings,
    saveAndApply,
    isLoaded,
  }
}
