"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const aiResponses: Record<string, string> = {
  overdue: "You currently have {count} overdue tasks. I recommend tackling the high-priority ones first to minimize the impact.",
  productivity: "Your productivity score is {score}%. Keep up the great work! Focus on completing one task at a time.",
  deadline: "You have {count} tasks due soon. Consider breaking them into smaller tasks to make progress.",
  priority: "You have {high} high-priority tasks. Let's prioritize these to make meaningful progress.",
  team: "Your team has been very active! {count} tasks were completed today by team members.",
  default: "I'm here to help you stay productive. Ask me about your tasks, deadlines, or team progress!",
}

function generateAIResponse(userInput: string, taskContext: { overdue: number; productivity: number; dueSoon: number; highPriority: number; teamCompleted: number }): string {
  const lowerInput = userInput.toLowerCase()
  
  if (lowerInput.includes("overdue")) {
    return aiResponses.overdue.replace("{count}", taskContext.overdue.toString())
  }
  if (lowerInput.includes("productivity") || lowerInput.includes("score")) {
    return aiResponses.productivity.replace("{score}", taskContext.productivity.toString())
  }
  if (lowerInput.includes("deadline") || lowerInput.includes("due soon")) {
    return aiResponses.deadline.replace("{count}", taskContext.dueSoon.toString())
  }
  if (lowerInput.includes("priority") || lowerInput.includes("important") || lowerInput.includes("urgent")) {
    return aiResponses.priority.replace("{high}", taskContext.highPriority.toString())
  }
  if (lowerInput.includes("team")) {
    return aiResponses.team.replace("{count}", taskContext.teamCompleted.toString())
  }
  
  return aiResponses.default
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI assistant. Ask me about your tasks, deadlines, productivity, or team progress!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { tasks, overdueTasks, completedToday, productivityScore } = useTasks()

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const taskContext = {
      overdue: overdueTasks.length,
      productivity: productivityScore,
      dueSoon: tasks.filter(t => {
        const deadline = new Date(t.deadline)
        const today = new Date()
        const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 3 && t.status !== "done"
      }).length,
      highPriority: tasks.filter(t => t.priority === "high" && t.status !== "done").length,
      teamCompleted: completedToday.length,
    }

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input, taskContext),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <Card className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
              <CardContent className="p-3">
                <p className="text-sm">{message.content}</p>
              </CardContent>
            </Card>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card>
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your tasks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
