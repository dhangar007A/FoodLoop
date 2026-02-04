import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/follow-button.css'

const FollowButton = ({ foodPartnerId, initialFollowing = false, onFollowChange }) => {
    const [following, setFollowing] = useState(initialFollowing)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkFollowStatus()
    }, [foodPartnerId])

    async function checkFollowStatus() {
        try {
            const response = await axios.get(`http://localhost:3000/api/follow/check/${foodPartnerId}`, {
                withCredentials: true
            })
            setFollowing(response.data.following)
        } catch (error) {
            console.error('Error checking follow status:', error)
        }
    }

    async function handleToggleFollow() {
        if (loading) return
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:3000/api/follow/toggle', {
                foodPartnerId
            }, { withCredentials: true })

            setFollowing(response.data.following)
            onFollowChange?.(response.data.following)
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            className={`follow-button ${following ? 'following' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleToggleFollow}
            disabled={loading}
        >
            {loading ? (
                <span className="follow-spinner"></span>
            ) : following ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                    Following
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Follow
                </>
            )}
        </button>
    )
}

export default FollowButton
