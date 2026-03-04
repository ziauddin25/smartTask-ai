'use client'

import Link from 'next/link'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 10 tasks',
        'Basic AI suggestions',
        'Weekly summary',
        'Mobile app access'
      ],
      cta: 'Get Started',
      featured: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      features: [
        'Unlimited tasks',
        'Advanced AI insights',
        'Priority support',
        'Time tracking',
        'Custom categories',
        'Analytics dashboard'
      ],
      cta: 'Start Free Trial',
      featured: true
    },
    {
      name: 'Business',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin controls',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      featured: false
    }
  ]

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your needs. All plans include a 14-day free trial.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div className={`pricing-card ${plan.featured ? 'featured' : ''}`} key={index}>
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.price}
                <span>{plan.period}</span>
              </div>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-large`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
