// import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-white to-purple-100" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent opacity-70" />
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-white/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
            <span>AI-Powered Productivity</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Work Smarter with{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              SmartTask AI
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
            Transform your productivity with intelligent task management. 
            Our AI analyzes your workload, prioritizes what matters, and helps you focus on what counts.
          </p>
          {/* <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try Dashboard Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div> */}
          <p className="mt-6 text-sm text-gray-500">
            No credit card required · Free forever plan available
          </p>
        </div>
      </div>
    </section>
  )
}
