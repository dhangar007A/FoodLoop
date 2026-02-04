import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/notification-bell.css'

const NotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchUnreadCount()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000)
        return () => clearInterval(interval)
    }, [])

    async function fetchUnreadCount() {
        try {
            const response = await axios.get('http://localhost:3000/api/notifications', {
                withCredentials: true
            })
            const unread = response.data.notifications?.filter(n => !n.isRead).length || 0
            setUnreadCount(unread)
        } catch (error) {
            // User might not be logged in
        }
    }

    return (
        <Link to="/notifications" className="notification-bell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
                <span className="notification-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Link>
    )
}

export default NotificationBell
