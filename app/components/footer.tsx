'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/" className="logo" style={{ color: 'white' }}>
              <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="currentColor"/>
                <path d="M8 16L14 22L24 10" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              SmartTask AI
            </Link>
            <p>AI-powered task management to boost your productivity and achieve your goals.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#">Integrations</Link></li>
              <li><Link href="#">API</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SmartTask AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
