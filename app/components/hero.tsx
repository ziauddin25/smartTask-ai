'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Boost Your Productivity with AI-Powered Task Management</h1>
        <p>SmartTask AI helps you organize tasks, prioritize work, and get things done with intelligent suggestions and automation.</p>
        <div className="hero-buttons">
          <Link href="/dashboard" className="btn btn-primary btn-large">Start Free Trial</Link>
          <Link href="/how-it-work" className="btn btn-secondary btn-large">Learn More</Link>
        </div>
      </div>
    </section>
  )
}
