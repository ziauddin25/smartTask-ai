"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { aiInsights } from "@/data/mockData"
import { AIChat } from "./AIChat"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AIInsightCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 10000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % aiInsights.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const goToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + aiInsights.length) % aiInsights.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <>
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">AI Insight</p>
                <p className={`text-white/80 transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`}>
                  {aiInsights[currentIndex]?.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={goToPrev}
                  aria-label="Previous insight"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  {aiInsights.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={goToNext}
                  aria-label="Next insight"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/20 ml-2">
                    Ask AI
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>AI Assistant</SheetTitle>
                  </SheetHeader>
                  <AIChat />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
