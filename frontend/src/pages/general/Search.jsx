import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../styles/search.css'
import { Link } from 'react-router-dom'

const Search = () => {
    const [query, setQuery] = useState('')
    const [activeTab, setActiveTab] = useState('food')
    const [results, setResults] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState('recent')
    const [loading, setLoading] = useState(false)
    const [trending, setTrending] = useState([])

    useEffect(() => {
        fetchCategories()
        fetchTrending()
    }, [])

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (query.trim() || selectedCategory) {
                performSearch()
            } else {
                setResults([])
            }
        }, 300)

        return () => clearTimeout(debounce)
    }, [query, activeTab, selectedCategory, sortBy])

    async function fetchCategories() {
        try {
            const response = await axios.get('http://localhost:3000/api/search/categories', {
                withCredentials: true
            })
            setCategories(response.data.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    async function fetchTrending() {
        try {
            const response = await axios.get('http://localhost:3000/api/search/trending', {
                withCredentials: true
            })
            setTrending(response.data.foods || [])
        } catch (error) {
            console.error('Error fetching trending:', error)
        }
    }

    async function performSearch() {
        setLoading(true)
        try {
            const endpoint = activeTab === 'food' ? '/api/search/food' : '/api/search/food-partners'
            const params = new URLSearchParams()
            if (query) params.append('q', query)
            if (selectedCategory && activeTab === 'food') params.append('category', selectedCategory)
            params.append('sort', sortBy)

            const response = await axios.get(`http://localhost:3000${endpoint}?${params}`, {
                withCredentials: true
            })

            setResults(activeTab === 'food' ? response.data.foods : response.data.foodPartners)
        } catch (error) {
            console.error('Error searching:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="search-page">
            <div className="search-header">
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search food or restaurants..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="search-input"
                    />
                    {query && (
                        <button className="search-clear" onClick={() => setQuery('')}>✕</button>
                    )}
                </div>

                <div className="search-tabs">
                    <button
                        className={`search-tab ${activeTab === 'food' ? 'active' : ''}`}
                        onClick={() => setActiveTab('food')}
                    >
                        Food
                    </button>
                    <button
                        className={`search-tab ${activeTab === 'partners' ? 'active' : ''}`}
                        onClick={() => setActiveTab('partners')}
                    >
                        Restaurants
                    </button>
                </div>
            </div>

            {activeTab === 'food' && (
                <div className="search-filters">
                    <div className="category-pills">
                        <button
                            className={`category-pill ${selectedCategory === '' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('')}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>

                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="trending">Trending</option>
                    </select>
                </div>
            )}

            <div className="search-results">
                {loading ? (
                    <div className="search-loading">Searching...</div>
                ) : results.length === 0 && (query || selectedCategory) ? (
                    <div className="search-empty">No results found</div>
                ) : results.length === 0 ? (
                    <div className="search-suggestions">
                        <h3>🔥 Trending Now</h3>
                        <div className="trending-grid">
                            {trending.map(item => (
                                <div key={item._id} className="trending-item">
                                    <video src={item.video} muted />
                                    <div className="trending-info">
                                        <span className="trending-name">{item.name}</span>
                                        <span className="trending-likes">❤️ {item.likeCount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={activeTab === 'food' ? 'food-grid' : 'partners-list'}>
                        {activeTab === 'food' ? (
                            results.map(food => (
                                <div key={food._id} className="food-card">
                                    <video src={food.video} muted />
                                    <div className="food-card-info">
                                        <h4>{food.name}</h4>
                                        <p>{food.description?.substring(0, 50)}...</p>
                                        <div className="food-card-stats">
                                            <span>❤️ {food.likeCount}</span>
                                            <span>💾 {food.savesCount}</span>
                                        </div>
                                        {food.foodPartner && (
                                            <Link to={`/food-partner/${food.foodPartner._id}`} className="food-card-partner">
                                                {food.foodPartner.name}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            results.map(partner => (
                                <Link key={partner._id} to={`/food-partner/${partner._id}`} className="partner-card">
                                    <div className="partner-avatar">
                                        {partner.profilePicture ? (
                                            <img src={partner.profilePicture} alt={partner.name} />
                                        ) : (
                                            <span>{partner.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="partner-info">
                                        <h4>{partner.name}</h4>
                                        <p>{partner.address}</p>
                                        <div className="partner-stats">
                                            <span>⭐ {partner.averageRating?.toFixed(1) || 'N/A'}</span>
                                            <span>👥 {partner.followersCount || 0} followers</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Search
