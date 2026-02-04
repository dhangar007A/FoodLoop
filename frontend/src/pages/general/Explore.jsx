import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../styles/explore.css'

const Explore = () => {
    const [exploreData, setExploreData] = useState({
        trending: [],
        recent: [],
        topPartners: [],
        categories: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExploreData()
    }, [])

    async function fetchExploreData() {
        try {
            const response = await axios.get('http://localhost:3000/api/search/explore', {
                withCredentials: true
            })
            setExploreData(response.data)
        } catch (error) {
            console.error('Error fetching explore data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="explore-loading">Loading...</div>
    }

    return (
        <main className="explore-page">
            <header className="explore-header">
                <h1>Explore</h1>
                <Link to="/search" className="search-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </Link>
            </header>

            {/* Categories */}
            <section className="explore-section">
                <h2>Categories</h2>
                <div className="categories-scroll">
                    {exploreData.categories.map(category => (
                        <Link key={category} to={`/search?category=${category}`} className="category-card">
                            <span className="category-emoji">
                                {getCategoryEmoji(category)}
                            </span>
                            <span className="category-name">{category}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending */}
            <section className="explore-section">
                <h2>🔥 Trending</h2>
                <div className="trending-scroll">
                    {exploreData.trending.map(food => (
                        <div key={food._id} className="trending-card">
                            <video src={food.video} muted loop playsInline />
                            <div className="trending-overlay">
                                <h4>{food.name}</h4>
                                <span>❤️ {food.likeCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Restaurants */}
            <section className="explore-section">
                <h2>⭐ Top Restaurants</h2>
                <div className="partners-list">
                    {exploreData.topPartners.map((partner, index) => (
                        <Link key={partner._id} to={`/food-partner/${partner._id}`} className="partner-item">
                            <span className="partner-rank">#{index + 1}</span>
                            <div className="partner-avatar">
                                {partner.profilePicture ? (
                                    <img src={partner.profilePicture} alt={partner.name} />
                                ) : (
                                    <span>{partner.name[0]}</span>
                                )}
                            </div>
                            <div className="partner-details">
                                <h4>{partner.name}</h4>
                                <p>{partner.address}</p>
                            </div>
                            <div className="partner-rating">
                                ⭐ {partner.averageRating?.toFixed(1) || 'N/A'}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent */}
            <section className="explore-section">
                <h2>🆕 Fresh & New</h2>
                <div className="recent-grid">
                    {exploreData.recent.map(food => (
                        <div key={food._id} className="recent-card">
                            <video src={food.video} muted />
                            <div className="recent-info">
                                <h4>{food.name}</h4>
                                {food.foodPartner && (
                                    <p>{food.foodPartner.name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}

function getCategoryEmoji(category) {
    const emojis = {
        'Pizza': '🍕',
        'Burger': '🍔',
        'Sushi': '🍣',
        'Pasta': '🍝',
        'Dessert': '🍰',
        'Drinks': '🥤',
        'Indian': '🍛',
        'Chinese': '🥡',
        'Mexican': '🌮',
        'Salad': '🥗',
        'Seafood': '🦐',
        'Vegan': '🥬',
        'Other': '🍴'
    }
    return emojis[category] || '🍴'
}

export default Explore
