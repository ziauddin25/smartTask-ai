
import '@/app/landing.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Features from './components/features'
import HowItWorks from './components/how-it-works'
import Pricing from './components/pricing'
import Testimonials from './components/testimonials'
import FAQ from './components/faq'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
