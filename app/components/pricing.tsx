'use client'

import { useRouter } from 'next/navigation'
import {
  Infinity,
  Brain,
  Headphones,
  Clock,
  Tag,
  BarChart2,
  Users,
  ShieldCheck,
  Code2,
  Puzzle,
  LifeBuoy,
  CheckCircle2,
  ListTodo,
  Sparkles,
  CalendarDays,
  Smartphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FREE_FEATURES = [
  { icon: ListTodo, label: 'Up to 10 tasks' },
  { icon: Sparkles, label: 'Basic AI suggestions' },
  { icon: CalendarDays, label: 'Weekly summary' },
  { icon: Smartphone, label: 'Mobile app access' },
]

const PRO_FEATURES = [
  { icon: Infinity, label: 'Unlimited tasks' },
  { icon: Brain, label: 'Advanced AI insights' },
  { icon: Headphones, label: 'Priority support' },
  { icon: Clock, label: 'Time tracking' },
  { icon: Tag, label: 'Custom categories' },
  { icon: BarChart2, label: 'Analytics dashboard' },
]

const BUSINESS_FEATURES = [
  { icon: CheckCircle2, label: 'Everything in Pro' },
  { icon: Users, label: 'Team collaboration' },
  { icon: ShieldCheck, label: 'Admin controls' },
  { icon: Code2, label: 'API access' },
  { icon: Puzzle, label: 'Custom integrations' },
  { icon: LifeBuoy, label: 'Dedicated support' },
]

const plans = [
  {
    name: 'Free',
    planType: null,
    price: '$0',
    period: '/month',
    features: FREE_FEATURES,
    cta: 'Get Started',
    featured: false,
    badge: null,
  },
  {
    name: 'Pro',
    planType: 'pro' as const,
    price: '$19',
    period: '/month',
    features: PRO_FEATURES,
    cta: 'Select Plan',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    planType: 'business' as const,
    price: '$49',
    period: '/month',
    features: BUSINESS_FEATURES,
    cta: 'Select Plan',
    featured: false,
    badge: null,
  },
]

export default function Pricing() {
  const router = useRouter()

  const handleSelectPlan = (planType: 'pro' | 'business') => {
    router.push(`/subscribe/${planType}`)
  }

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your needs. All plans include a 14-day free trial.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative flex flex-col gap-6 ${plan.featured ? 'featured' : ''}`}
            >
              {/* Badge */}
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 text-xs font-semibold shadow">
                  {plan.badge}
                </Badge>
              )}

              {/* Header */}
              <div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map(({ icon: Icon, label }, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${plan.featured ? 'bg-indigo-100' : 'bg-muted'}`}>
                      <Icon
                        size={14}
                        strokeWidth={2.2}
                        className={plan.featured ? 'text-indigo-600' : 'text-muted-foreground'}
                      />
                    </span>
                    <span className="text-foreground/80">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.planType === null ? (
                <Button asChild variant="outline" className="w-full mt-auto">
                  <a href="/auth/sign-up">{plan.cta}</a>
                </Button>
              ) : (
                <Button
                  className={`w-full mt-auto ${plan.featured ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                  variant={plan.featured ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.planType!)}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
