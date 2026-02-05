import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../../config/api';
import { Link } from 'react-router-dom'
import '../../styles/user-profile.css'
import ThemeToggle from '../../components/ThemeToggle'

const UserProfile = () => {
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({})
    const [activeTab, setActiveTab] = useState('liked')
    const [likedVideos, setLikedVideos] = useState([])
    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({ fullName: '', bio: '' })

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (activeTab === 'liked') {
            fetchLikedVideos()
        } else if (activeTab === 'following') {
            fetchFollowing()
        }
    }, [activeTab])

    async function fetchProfile() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            })
            setUser(response.data.user)
            setStats(response.data.stats)
            setFormData({
                fullName: response.data.user.fullName,
                bio: response.data.user.bio || ''
            })
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchLikedVideos() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/liked`, {
                withCredentials: true
            })
            setLikedVideos(response.data.videos || [])
        } catch (error) {
            console.error('Error fetching liked videos:', error)
        }
    }

    async function fetchFollowing() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/follow/following`, {
                withCredentials: true
            })
            setFollowing(response.data.following || [])
        } catch (error) {
            console.error('Error fetching following:', error)
        }
    }

    async function handleUpdateProfile(e) {
        e.preventDefault()
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/user/profile`, formData, {
                withCredentials: true
            })
            setUser(response.data.user)
            setEditMode(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    async function handleProfilePicture(e) {
        const file = e.target.files[0]
        if (!file) return

        const formDataObj = new FormData()
        formDataObj.append('profilePicture', file)

        try {
            const response = await axios.patch(`${API_BASE_URL}/api/user/profile`, formDataObj, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUser(response.data.user)
        } catch (error) {
            console.error('Error uploading profile picture:', error)
        }
    }

    async function handleLogout() {
        try {
            await axios.get(`${API_BASE_URL}/api/auth/user/logout`, {
                withCredentials: true
            })
            window.location.href = '/user/login'
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    if (loading) {
        return <div className="profile-loading">Loading...</div>
    }

    return (
        <main className="user-profile-page">
            <header className="user-profile-header">
                <div className="user-avatar-wrapper">
                    <div className="user-avatar">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} />
                        ) : (
                            <span>{user?.fullName?.[0]?.toUpperCase()}</span>
                        )}
                    </div>
                    <label className="avatar-upload">
                        <input type="file" accept="image/*" onChange={handleProfilePicture} hidden />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                            <path d="M9 2 7.2 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.2L15 2H9z" />
                        </svg>
                    </label>
                </div>

                {editMode ? (
                    <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Full Name"
                        />
                        <textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Bio (max 150 characters)"
                            maxLength={150}
                        />
                        <div className="edit-actions">
                            <button type="submit" className="btn-save">Save</button>
                            <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="user-info">
                        <h1>{user?.fullName}</h1>
                        <p className="user-email">{user?.email}</p>
                        {user?.bio && <p className="user-bio">{user.bio}</p>}
                        <button className="btn-edit" onClick={() => setEditMode(true)}>Edit Profile</button>
                    </div>
                )}

                <div className="user-stats">
                    <div className="stat">
                        <span className="stat-value">{stats.likesCount || 0}</span>
                        <span className="stat-label">Liked</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.savesCount || 0}</span>
                        <span className="stat-label">Saved</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.followingCount || 0}</span>
                        <span className="stat-label">Following</span>
                    </div>
                </div>
            </header>

            <nav className="profile-tabs">
                <button
                    className={activeTab === 'liked' ? 'active' : ''}
                    onClick={() => setActiveTab('liked')}
                >
                    ❤️ Liked
                </button>
                <button
                    className={activeTab === 'saved' ? 'active' : ''}
                    onClick={() => setActiveTab('saved')}
                >
                    💾 Saved
                </button>
                <button
                    className={activeTab === 'following' ? 'active' : ''}
                    onClick={() => setActiveTab('following')}
                >
                    👥 Following
                </button>
            </nav>

            <section className="profile-content">
                {activeTab === 'liked' && (
                    <div className="videos-grid">
                        {likedVideos.length === 0 ? (
                            <p className="empty-state">No liked videos yet</p>
                        ) : (
                            likedVideos.map(video => (
                                <div key={video._id} className="video-thumbnail">
                                    <video src={video.video} muted />
                                    <div className="video-overlay">
                                        <span>❤️ {video.likeCount}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="videos-grid">
                        <p className="empty-state">Check the Saved page for your saved videos</p>
                        <Link to="/saved" className="btn-view-saved">View Saved</Link>
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="following-list">
                        {following.length === 0 ? (
                            <p className="empty-state">Not following anyone yet</p>
                        ) : (
                            following.map(partner => (
                                <Link key={partner._id} to={`/food-partner/${partner._id}`} className="following-item">
                                    <div className="following-avatar">
                                        {partner.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="following-info">
                                        <h4>{partner.name}</h4>
                                        <p>{partner.address}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </section>

            <button className="btn-logout" onClick={handleLogout}>
                Logout
            </button>

            {/* Theme Toggle */}
            <div className="theme-section">
                <h3>Appearance</h3>
                <ThemeToggle />
            </div>
        </main>
    )
}

export default UserProfile