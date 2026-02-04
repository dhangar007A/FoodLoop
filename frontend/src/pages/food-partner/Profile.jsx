import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import FollowButton from '../../components/FollowButton'
import RatingModal from '../../components/RatingModal'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [showRating, setShowRating] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)

    useEffect(() => {
        axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems || [])
                setFollowersCount(response.data.foodPartner.followersCount || 0)
            })
        
        // Check if user is following this food partner
        axios.get(`http://localhost:3000/api/follow/check/${id}`, { withCredentials: true })
            .then(response => {
                setIsFollowing(response.data.isFollowing)
            })
            .catch(() => {})
    }, [id])

    const handleFollowChange = (nowFollowing) => {
        setIsFollowing(nowFollowing)
        setFollowersCount(prev => nowFollowing ? prev + 1 : prev - 1)
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating || 0)
        const hasHalf = (rating || 0) - fullStars >= 0.5
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star filled">★</span>)
            } else if (i === fullStars && hasHalf) {
                stars.push(<span key={i} className="star half">★</span>)
            } else {
                stars.push(<span key={i} className="star">★</span>)
            }
        }
        return stars
    }

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <img 
                        className="profile-avatar" 
                        src={profile?.profilePicture || "https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60"} 
                        alt={profile?.name} 
                    />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                            {profile?.isVerified && <span className="verified-badge" title="Verified">✓</span>}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                        
                        {/* Rating display */}
                        <div className="profile-rating" onClick={() => setShowRating(true)}>
                            <div className="stars">
                                {renderStars(profile?.averageRating)}
                            </div>
                            <span className="rating-text">
                                {profile?.averageRating?.toFixed(1) || '0.0'} ({profile?.totalRatings || 0} reviews)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Follow button */}
                <div className="profile-actions">
                    <FollowButton 
                        foodPartnerId={id} 
                        initialFollowing={isFollowing}
                        onFollowChange={handleFollowChange}
                    />
                    <button className="profile-action-btn" onClick={() => setShowRating(true)}>
                        Rate
                    </button>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-value">{followersCount}</span>
                        <span className="profile-stat-label">followers</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-value">{profile?.totalMeals || videos.length}</span>
                        <span className="profile-stat-label">dishes</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-value">{profile?.customersServed || 0}</span>
                        <span className="profile-stat-label">served</span>
                    </div>
                </div>

                {/* Bio section */}
                {profile?.bio && (
                    <p className="profile-bio">{profile.bio}</p>
                )}

                {/* Categories */}
                {profile?.categories && profile.categories.length > 0 && (
                    <div className="profile-categories">
                        {profile.categories.map((cat, idx) => (
                            <span key={idx} className="category-tag">{cat}</span>
                        ))}
                    </div>
                )}
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.length === 0 ? (
                    <div className="empty-grid">
                        <p>No dishes posted yet</p>
                    </div>
                ) : (
                    videos.map((v) => (
                        <div key={v._id || v.id} className="profile-grid-item">
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video} 
                                muted
                            />
                            <div className="grid-item-overlay">
                                <span className="grid-item-likes">❤ {v.likeCount || 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRating}
                onClose={() => setShowRating(false)}
                foodPartnerId={id}
                foodPartnerName={profile?.name}
            />
        </main>
    )
}

export default Profile