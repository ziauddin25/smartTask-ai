"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
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
  overdue: "You currently have {count} overdue tasks. This is concerning as these tasks are past their due dates and may be affecting your workflow. I strongly recommend tackling the high-priority overdue tasks first to minimize the impact on your overall productivity. Consider breaking these tasks into smaller, manageable steps and set aside dedicated time to complete them as soon as possible. Remember, the sooner you start, the sooner you'll be back on track!",
  productivity: "Your current productivity score is {score}%. That's impressive! Keep up the great work and maintain your momentum. To stay productive, I recommend focusing on completing one task at a time rather than multitasking. Use the Pomodoro technique - work for 25 minutes, then take a 5-minute break. This helps maintain focus while preventing burnout. You're doing amazing, keep it up!",
  deadline: "You have {count} tasks due soon that need your attention. This is a busy period, but don't panic! I recommend breaking these tasks into smaller, more manageable subtasks to make steady progress. Prioritize based on urgency and importance using the Eisenhower Matrix. Start with what matters most, and don't hesitate to ask for help if needed. You've got this!",
  priority: "You have {high} high-priority tasks that require your immediate attention. These tasks are crucial and should be at the top of your to-do list. I recommend tackling them during your peak productivity hours when you're most focused. Consider using the 1-3-5 rule: tackle 1 big task, 3 medium tasks, and 5 small tasks each day. This approach helps maintain balance while ensuring critical tasks get completed.",
  team: "Your team has been incredibly active today! {count} tasks were completed by team members, showing excellent collaboration and dedication. This collective effort contributes significantly to overall project success. Take a moment to appreciate the team's hard work! If you're managing team tasks, consider acknowledging individual contributions to boost morale and motivation.",
  summary: "Here's a comprehensive overview of your current task status: You have {overdue} overdue tasks, {dueSoon} tasks due soon, {high} high-priority tasks, and your team has completed {team} tasks today. With a productivity score of {score}%, you're doing great! Remember to stay focused, prioritize wisely, and take regular breaks to maintain optimal performance.",
  help: "I can help you with various aspects of your tasks and productivity. Here are some things you can ask me:\n\n• 'How many overdue tasks do I have?' - Get details on overdue tasks\n• 'What's my productivity score?' - See your current productivity percentage\n• 'What deadlines are coming up?' - Check tasks due soon\n• 'Show me priority tasks' - View high-priority items\n• 'Team progress' - See what your team has accomplished\n• 'Give me a summary' - Get a complete overview of your task status\n\nFeel free to ask any question about your tasks!",
  motivation: "Stay motivated! Every small step counts toward achieving your goals. Remember why you started and keep pushing forward. You've already accomplished so much, and each completed task brings you closer to success. Take pride in your progress and keep moving forward. I'm here to support you every step of the way!",
  tips: "Here are some productivity tips to help you work more efficiently:\n\n1. Start your day with the most important task (MIT)\n2. Use time-blocking to dedicate focus time\n3. Take regular breaks to maintain energy\n4. Batch similar tasks together\n5. Set realistic daily goals\n6. Review your tasks the night before\n7. Celebrate small wins to stay motivated\n\nImplementing even a few of these can significantly boost your productivity!",
  default: "I'm your AI assistant here to help you stay productive and organized. You can ask me about your tasks, deadlines, team progress, or productivity tips. I'm here to support you in managing your work effectively. What would you like to know more about?",
}

function generateAIResponse(userInput: string, taskContext: { overdue: number; productivity: number; dueSoon: number; highPriority: number; teamCompleted: number }): string {
  const lowerInput = userInput.toLowerCase()
  
  if (lowerInput.includes("overdue")) {
    return aiResponses.overdue.replace("{count}", taskContext.overdue.toString())
  }
  if (lowerInput.includes("productivity") || lowerInput.includes("score")) {
    return aiResponses.productivity.replace("{score}", taskContext.productivity.toString())
  }
  if (lowerInput.includes("deadline") || lowerInput.includes("due soon") || lowerInput.includes("upcoming")) {
    return aiResponses.deadline.replace("{count}", taskContext.dueSoon.toString())
  }
  if (lowerInput.includes("priority") || lowerInput.includes("important") || lowerInput.includes("urgent")) {
    return aiResponses.priority.replace("{high}", taskContext.highPriority.toString())
  }
  if (lowerInput.includes("team")) {
    return aiResponses.team.replace("{count}", taskContext.teamCompleted.toString())
  }
  if (lowerInput.includes("summary") || lowerInput.includes("overview") || lowerInput.includes("status")) {
    return aiResponses.summary
      .replace("{overdue}", taskContext.overdue.toString())
      .replace("{dueSoon}", taskContext.dueSoon.toString())
      .replace("{high}", taskContext.highPriority.toString())
      .replace("{team}", taskContext.teamCompleted.toString())
      .replace("{score}", taskContext.productivity.toString())
  }
  if (lowerInput.includes("help") || lowerInput.includes("what can you do") || lowerInput.includes("commands")) {
    return aiResponses.help
  }
  if (lowerInput.includes("motivate") || lowerInput.includes("encourage") || lowerInput.includes("inspire")) {
    return aiResponses.motivation
  }
  if (lowerInput.includes("tip") || lowerInput.includes("advice") || lowerInput.includes("suggestion")) {
    return aiResponses.tips
  }
  
  return aiResponses.default
}

export function AIChat() {
  const { user } = useUser()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI productivity assistant. I can help you with:\n\n• Overview of your task status\n• Overdue tasks analysis\n• Productivity insights and scores\n• Upcoming deadlines\n• Priority task tracking\n• Team progress updates\n• Productivity tips and motivation\n\nJust ask me anything about your tasks or workflow!",
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
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-1 overflow-y-auto space-y-6 py-6 pe-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                {/* <Bot className="h-5 w-5 text-white" /> */}
                <img src="/smarttask-logo.svg" alt="logo" />
              </div>
            )}
            <Card className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
              <CardContent className="p-3">
                <p className="text-base leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
              </CardContent>
            </Card>
            {message.role === "user" && (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="User" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <Card>
              <CardContent className="p-2">
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-3 w-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-3 w-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <div className="py-6 px-3 border-t bg-background">
        <div className="flex gap-3">
          <Input
            className="h-12 text-base"
            placeholder="Ask about your tasks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSend} size="icon" className="h-12 w-12">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
