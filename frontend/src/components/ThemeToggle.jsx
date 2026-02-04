import React, { useState, useEffect } from 'react'
import '../styles/theme-toggle.css'

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system'
    })

    useEffect(() => {
        applyTheme(theme)
    }, [theme])

    function applyTheme(selectedTheme) {
        localStorage.setItem('theme', selectedTheme)

        if (selectedTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
        } else {
            document.documentElement.setAttribute('data-theme', selectedTheme)
        }
    }

    function handleChange(newTheme) {
        setTheme(newTheme)
    }

    return (
        <div className="theme-toggle">
            <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleChange('light')}
                title="Light mode"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            </button>

            <button
                className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleChange('system')}
                title="System preference"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            </button>

            <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleChange('dark')}
                title="Dark mode"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </button>
        </div>
    )
}

export default ThemeToggle
