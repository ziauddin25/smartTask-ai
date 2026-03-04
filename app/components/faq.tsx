'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does SmartTask AI work?',
      answer: 'SmartTask AI uses advanced machine learning algorithms to analyze your tasks, deadlines, and work patterns. It then provides intelligent suggestions for prioritization, time estimation, and workflow optimization.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. All your data is encrypted using industry-standard encryption protocols. We also comply with GDPR and other privacy regulations.'
    },
    {
      question: 'Can I use SmartTask AI with my team?',
      answer: 'Absolutely! Our Business plan includes team collaboration features. You can share tasks, assign responsibilities, and track team progress together.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required. You can explore all features before committing.'
    },
    {
      question: 'What platforms does SmartTask AI support?',
      answer: 'SmartTask AI is available on web, iOS, and Android. Your data syncs automatically across all devices.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.'
    }
  ]

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Have questions? We're here to help.</p>
        </div>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div 
                className="faq-question" 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <span>{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
