'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { User, LayoutDashboard, Settings, LogOut, Menu, X, Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const { themeSettings, setTheme, setAccentColor, applyTheme, saveAndApply } = useTheme()

  useEffect(() => {
    applyTheme(themeSettings)
  }, [])

  // Close theme dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme)
    saveAndApply()
    setThemeDropdownOpen(false)
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const getCurrentThemeIcon = () => {
    const option = themeOptions.find(opt => opt.value === themeSettings.theme)
    if (option) {
      const Icon = option.icon
      return <Icon size={18} />
    }
    return <Moon size={18} />
  }

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
          <a href="/" className="flex items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smarttask-logo.svg" alt="SmartTask AI" className="w-9 h-9" />
          <span className="text-lg font-extrabold tracking-tight text-foreground">SmartTask AI</span>
        </a>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smarttask-logo.svg" alt="SmartTask AI" className="w-9 h-9" />
          <span className="text-lg font-extrabold tracking-tight text-foreground">SmartTask AI</span>
        </a>

        {/* Desktop Navigation Links - Visible when NOT signed in */}
        {/* {isSignedIn && ( */}
          <div className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>
        {/* )} */}

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
          {/* Theme Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="!mt-3 bg-secondary text-muted-foreground cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Select theme"
            >
              {getCurrentThemeIcon()}
              {/* <ChevronDown size={14} className={`transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180' : ''}`} /> */}
            </button>
            
            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[160px] bg-white rounded-xl !p-4 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                    className={`flex !mt-2 items-center text-black gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 border-none bg-transparent ${themeSettings.theme === option.value ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <option.icon size={18} />
                    <span>{option.label}</span>
                    {themeSettings.theme === option.value && (
                      <Check size={16} className="ml-auto font-bold" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

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

                  {/* Account Link */}
                  <Link 
                    href="/account" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={18} />
                    <span>Manage Account</span>
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
          {/* Mobile Theme Options */}
          <div className="mobile-theme-section">
            <p className="mobile-section-label">Theme</p>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                className={`mobile-nav-item mobile-theme-item ${themeSettings.theme === option.value ? 'active' : ''}`}
                onClick={() => {
                  handleThemeChange(option.value as 'light' | 'dark' | 'system')
                  setMobileMenuOpen(false)
                }}
              >
                <option.icon size={20} />
                <span>{option.label}</span>
                {themeSettings.theme === option.value && (
                  <span className="mobile-theme-check">✓</span>
                )}
              </button>
            ))}
          </div>

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
              <Link href="/account" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} />
                Manage Account
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
