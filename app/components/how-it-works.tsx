'use client'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create Tasks',
      description: 'Add your tasks quickly using natural language. Our AI understands context and deadlines.'
    },
    {
      number: 2,
      title: 'Get AI Insights',
      description: 'Receive smart suggestions for prioritization, time estimates, and workflow optimization.'
    },
    {
      number: 3,
      title: 'Achieve Goals',
      description: 'Complete tasks efficiently with AI guidance and track your progress with detailed analytics.'
    }
  ]

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in minutes with our simple three-step process.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step" key={index}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
