import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../config/api';
import '../styles/rating.css'

const RatingModal = ({ isOpen, onClose, foodPartnerId, foodPartnerName }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [existingRating, setExistingRating] = useState(null)
    const [allRatings, setAllRatings] = useState([])
    const [distribution, setDistribution] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('write')

    useEffect(() => {
        if (isOpen && foodPartnerId) {
            fetchUserRating()
            fetchAllRatings()
        }
    }, [isOpen, foodPartnerId])

    async function fetchUserRating() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/ratings/user/${foodPartnerId}`, {
                withCredentials: true
            })
            if (response.data.rating) {
                setExistingRating(response.data.rating)
                setRating(response.data.rating.rating)
                setReview(response.data.rating.review || '')
            }
        } catch (error) {
            console.error('Error fetching user rating:', error)
        }
    }

    async function fetchAllRatings() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/ratings/food-partner/${foodPartnerId}`, {
                withCredentials: true
            })
            setAllRatings(response.data.ratings || [])
            setDistribution(response.data.distribution || [])
        } catch (error) {
            console.error('Error fetching ratings:', error)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (rating === 0) return

        setLoading(true)
        try {
            await axios.post(`${API_BASE_URL}/api/ratings`, {
                foodPartnerId,
                rating,
                review
            }, { withCredentials: true })

            fetchAllRatings()
            setActiveTab('view')
        } catch (error) {
            console.error('Error submitting rating:', error)
        } finally {
            setLoading(false)
        }
    }

    function formatTime(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (!isOpen) return null

    const averageRating = allRatings.length > 0
        ? (allRatings.reduce((acc, r) => acc + r.rating, 0) / allRatings.length).toFixed(1)
        : 0

    return (
        <div className="rating-overlay" onClick={onClose}>
            <div className="rating-modal" onClick={e => e.stopPropagation()}>
                <div className="rating-header">
                    <h2>Rate {foodPartnerName}</h2>
                    <button className="rating-close" onClick={onClose}>✕</button>
                </div>

                <div className="rating-tabs">
                    <button
                        className={activeTab === 'write' ? 'active' : ''}
                        onClick={() => setActiveTab('write')}
                    >
                        Write Review
                    </button>
                    <button
                        className={activeTab === 'view' ? 'active' : ''}
                        onClick={() => setActiveTab('view')}
                    >
                        All Reviews ({allRatings.length})
                    </button>
                </div>

                {activeTab === 'write' ? (
                    <form className="rating-form" onSubmit={handleSubmit}>
                        <div className="stars-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className="rating-label">
                            {rating === 0 ? 'Tap to rate' :
                                rating === 1 ? 'Poor' :
                                    rating === 2 ? 'Fair' :
                                        rating === 3 ? 'Good' :
                                            rating === 4 ? 'Very Good' : 'Excellent'}
                        </p>

                        <textarea
                            placeholder="Write your review (optional)"
                            value={review}
                            onChange={e => setReview(e.target.value)}
                            maxLength={1000}
                        />

                        <button type="submit" className="submit-rating" disabled={rating === 0 || loading}>
                            {loading ? 'Submitting...' : existingRating ? 'Update Review' : 'Submit Review'}
                        </button>
                    </form>
                ) : (
                    <div className="ratings-view">
                        <div className="ratings-summary">
                            <div className="average-rating">
                                <span className="big-number">{averageRating}</span>
                                <div className="stars-display">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={star <= Math.round(averageRating) ? 'filled' : ''}>★</span>
                                    ))}
                                </div>
                                <span className="total-reviews">{allRatings.length} reviews</span>
                            </div>

                            <div className="rating-bars">
                                {[5, 4, 3, 2, 1].map(num => {
                                    const count = distribution.find(d => d._id === num)?.count || 0
                                    const percentage = allRatings.length > 0 ? (count / allRatings.length) * 100 : 0
                                    return (
                                        <div key={num} className="rating-bar-row">
                                            <span>{num}★</span>
                                            <div className="rating-bar">
                                                <div className="rating-bar-fill" style={{ width: `${percentage}%` }} />
                                            </div>
                                            <span>{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="ratings-list">
                            {allRatings.map(r => (
                                <div key={r._id} className="rating-item">
                                    <div className="rating-item-header">
                                        <div className="rating-user">
                                            <span className="user-avatar">{r.user?.fullName?.[0]}</span>
                                            <span className="user-name">{r.user?.fullName}</span>
                                        </div>
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className={star <= r.rating ? 'filled' : ''}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    {r.review && <p className="rating-review">{r.review}</p>}
                                    <span className="rating-date">{formatTime(r.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RatingModal