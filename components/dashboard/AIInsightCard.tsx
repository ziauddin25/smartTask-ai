"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
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
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % aiInsights.length)
      setTimeout(() => setIsAnimating(false), 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
              <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/20">
                    Ask AI
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] bg-red sm:w-[540px]">
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
