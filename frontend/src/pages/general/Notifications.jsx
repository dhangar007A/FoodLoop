import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../../config/api';
import '../../styles/notifications.css'

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
    }, [])

    async function fetchNotifications() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/notifications/user`, {
                withCredentials: true
            })
            setNotifications(response.data.notifications || [])
            setUnreadCount(response.data.unreadCount || 0)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    async function markAsRead(notificationId) {
        try {
            await axios.patch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {}, {
                withCredentials: true
            })
            setNotifications(prev => prev.map(n =>
                n._id === notificationId ? { ...n, isRead: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    async function markAllAsRead() {
        try {
            await axios.patch(`${API_BASE_URL}/api/notifications/read-all`, {}, {
                withCredentials: true
            })
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    async function deleteNotification(notificationId) {
        try {
            await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`, {
                withCredentials: true
            })
            setNotifications(prev => prev.filter(n => n._id !== notificationId))
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'like': return '❤️'
            case 'comment': return '💬'
            case 'follow': return '👤'
            case 'new_video': return '🎬'
            case 'reply': return '↩️'
            default: return '🔔'
        }
    }

    function formatTime(date) {
        const diff = Date.now() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}d ago`
        if (hours > 0) return `${hours}h ago`
        if (minutes > 0) return `${minutes}m ago`
        return 'Just now'
    }

    if (loading) {
        return <div className="notifications-loading">Loading...</div>
    }

    return (
        <main className="notifications-page">
            <header className="notifications-header">
                <h1>Notifications</h1>
                {unreadCount > 0 && (
                    <button className="mark-all-read" onClick={markAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </header>

            {notifications.length === 0 ? (
                <div className="notifications-empty">
                    <span className="empty-icon">🔔</span>
                    <p>No notifications yet</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                            <span className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </span>
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">{formatTime(notification.createdAt)}</span>
                            </div>
                            <button
                                className="notification-delete"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification._id)
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default Notifications