'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  CheckCircle2,
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
  Lock,
  CreditCard,
  PartyPopper,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// ─── Plan data ────────────────────────────────────────────────────────────────

type PlanDetail = {
  name: string
  price: string
  amount: number
  period: string
  accentClass: string
  badgeBg: string
  btnClass: string
  iconBg: string
  iconColor: string
  features: { icon: React.ElementType; label: string }[]
}

const PLAN_DETAILS: Record<string, PlanDetail> = {
  pro: {
    name: 'Pro',
    price: '$19',
    amount: 19,
    period: '/month',
    accentClass: 'text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700',
    btnClass: 'bg-sky-600 hover:bg-sky-700',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    features: [
      { icon: Infinity, label: 'Unlimited tasks' },
      { icon: Brain, label: 'Advanced AI insights' },
      { icon: Headphones, label: 'Priority support' },
      { icon: Clock, label: 'Time tracking' },
      { icon: Tag, label: 'Custom categories' },
      { icon: BarChart2, label: 'Analytics dashboard' },
    ],
  },
  business: {
    name: 'Business',
    price: '$49',
    amount: 49,
    period: '/month',
    accentClass: 'text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700',
    btnClass: 'bg-sky-600 hover:bg-sky-700',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    features: [
      { icon: CheckCircle2, label: 'Everything in Pro' },
      { icon: Users, label: 'Team collaboration' },
      { icon: ShieldCheck, label: 'Admin controls' },
      { icon: Code2, label: 'API access' },
      { icon: Puzzle, label: 'Custom integrations' },
      { icon: LifeBuoy, label: 'Dedicated support' },
    ],
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubscribePage() {
  const router = useRouter()
  const params = useParams()
  const { isSignedIn, isLoaded, user } = useUser()

  const plan = params?.plan as string
  const planData = PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS]

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      const returnUrl = encodeURIComponent(`/subscribe/${plan}`)
      router.push(`/auth/sign-in?redirect_url=${returnUrl}`)
    }
  }, [isLoaded, isSignedIn, plan, router])

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
  }

  const formatCvc = (val: string) => val.replace(/\D/g, '').slice(0, 4)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Cardholder name is required'
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number'
    if (expiry.replace(/[\s/]/g, '').length < 4) e.expiry = 'Enter a valid expiry date'
    if (cvc.length < 3) e.cvc = 'Enter a valid CVC'
    return e
  }

  const handlePay = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setShowSuccess(true)
  }

  if (!planData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans">
        <h1 className="text-3xl font-bold text-red-500">Invalid Plan</h1>
        <p className="text-muted-foreground">The plan you selected does not exist.</p>
        {/* <Button variant="outline" onClick={() => router.push('/#pricing')}>
          <ArrowLeft size={15} className="mr-2" /> Back to Pricing
        </Button> */}
      </div>
    )
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-9 h-9 rounded-full border-4 border-muted border-t-indigo-600 animate-spin" />
        <p className="text-muted-foreground text-sm">Checking authentication…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border flex items-center justify-between px-6 md:px-10 h-16">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smarttask-logo.svg" alt="SmartTask AI" className="w-9 h-9" />
          <span className="text-lg font-extrabold tracking-tight text-foreground">SmartTask AI</span>
        </a>
        <div className="flex items-center gap-3">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${planData.btnClass}`}>
              {user?.firstName?.[0] ?? '?'}
            </div>
          )}
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* ── Plan Details ── */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
            <div>
              <Badge className={`mb-3 text-xs font-semibold px-3 py-1 ${planData.badgeBg}`}>
                {planData.name} Plan
              </Badge>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-extrabold ${planData.accentClass}`}>{planData.price}</span>
                <span className="text-muted-foreground text-base">{planData.period}</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Everything you need to supercharge your productivity.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {planData.features.map(({ icon: Icon, label }, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${planData.iconBg}`}>
                    <Icon size={14} strokeWidth={2.2} className={planData.iconColor} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
              <Lock size={12} />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>

          {/* ── Payment Form ── */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className={planData.accentClass} />
              <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
            </div>

            {/* Cardholder name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cardholder Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className={errors.name ? 'border-red-400 bg-red-50 focus-visible:ring-red-300' : ''}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Card number */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Card Number
              </Label>
              <Input
                id="card"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                inputMode="numeric"
                className={errors.cardNumber ? 'border-red-400 bg-red-50 focus-visible:ring-red-300' : ''}
              />
              {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expiry" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  inputMode="numeric"
                  className={errors.expiry ? 'border-red-400 bg-red-50 focus-visible:ring-red-300' : ''}
                />
                {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvc" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="•••"
                  value={cvc}
                  onChange={e => setCvc(formatCvc(e.target.value))}
                  inputMode="numeric"
                  type="password"
                  className={errors.cvc ? 'border-red-400 bg-red-50 focus-visible:ring-red-300' : ''}
                />
                {errors.cvc && <p className="text-xs text-red-500">{errors.cvc}</p>}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{planData.name} Plan</span>
                <span className="font-semibold text-foreground">{planData.price}{planData.period}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>14-day free trial</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-foreground text-base">
                <span>Total today</span>
                <span>$0.00</span>
              </div>
            </div>

            {/* Pay button */}
            <Button
              className={`w-full gap-2 text-base font-bold py-6 text-white ${planData.btnClass}`}
              onClick={handlePay}
            >
              <Lock size={15} />
              Pay {planData.price}{planData.period} after trial
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              You won't be charged today. Cancel anytime before your trial ends.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-border px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © 2026 SmartTask AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </footer>

      {/* ── Success Dialog ── */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center rounded-2xl p-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${planData.iconBg}`}>
            <PartyPopper size={40} className={planData.iconColor} />
          </div>
          <DialogHeader className="items-center">
            <DialogTitle className="text-2xl font-extrabold">Payment Successful! 🎉</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
              Welcome to the <strong className="text-foreground">{planData.name}</strong> plan!<br />
              Your 14-day free trial has started. Enjoy all premium features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              className={`w-full text-white font-bold py-5 ${planData.btnClass}`}
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
