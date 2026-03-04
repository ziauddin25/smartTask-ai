'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { User, LayoutDashboard, Settings, LogOut, Menu, X, Home, Layers, CreditCard, HelpCircle } from 'lucide-react'

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Navigation links for landing page
  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle sign out
  const handleSignOut = async () => {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    await signOut()
    router.push('/auth/sign-in')
  }

  // Loading state
  if (!isLoaded) {
    return (
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="logo">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor"/>
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SmartTask AI
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="currentColor"/>
            <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          SmartTask AI
        </Link>

        {/* Desktop Navigation Links - Visible when NOT signed in */}
        {isSignedIn && (
          <div className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation - User Actions */}
        <div className="nav-actions desktop-nav">
          {isSignedIn && user ? (
            /* User is signed in - show profile dropdown */
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Open user menu"
              >
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="user-avatar-img"
                  />
                ) : (
                  <div className="user-avatar-fallback">
                    <User size={20} />
                  </div>
                )}
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="user-dropdown">
                  {/* User Info Header */}
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.fullName || 'User'}</p>
                    <p className="dropdown-email">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Dashboard Link */}
                  <Link 
                    href="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  
                  {/* Settings Link */}
                  <Link 
                    href="/settings" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>

                  {/* Account Link */}
                  <Link 
                    href="/account" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={18} />
                    <span>Account</span>
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Sign Out Button */}
                  <button className="dropdown-item sign-out" onClick={handleSignOut}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* User is not signed in - show Sign In and Get Started */
            <>
              <Link href="/auth/sign-in" className="nav-link">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Nav Links - Visible when NOT signed in */}
          {!isSignedIn && (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mobile-nav-divider"></div>
            </>
          )}

          {isSignedIn && user ? (
            <>
              {/* Mobile User Info */}
              <div className="mobile-user-info">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="User" className="mobile-user-avatar" />
                ) : (
                  <div className="mobile-user-avatar-fallback">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <p className="mobile-user-name">{user.fullName || 'User'}</p>
                  <p className="mobile-user-email">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              
              <div className="mobile-nav-divider"></div>
              
              <Link href="/dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              
              <Link href="/settings" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Settings size={20} />
                Settings
              </Link>

              <Link href="/account" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} />
                Account
              </Link>
              
              <div className="mobile-nav-divider"></div>
              
              <button className="mobile-nav-item sign-out" onClick={handleSignOut}>
                <LogOut size={20} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="mobile-nav-item btn-mobile" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
