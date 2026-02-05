import React, { useEffect, useState } from 'react'
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import Header from '../../components/Header'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [activeTab, setActiveTab] = useState('foryou') // 'foryou' or 'following'
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const endpoint = activeTab === 'following' 
            ? `${API_BASE_URL}/api/user/following-feed`
            : `${API_BASE_URL}/api/food`
        
        axios.get(endpoint, { withCredentials: true })
            .then(response => {
                const items = activeTab === 'following' 
                    ? response.data.videos 
                    : response.data.foodItems
                setVideos(items || [])
            })
            .catch(() => { 
                setVideos([])
            })
            .finally(() => setLoading(false))
    }, [activeTab])

    async function likeVideo(item) {
        const response = await axios.post(`${API_BASE_URL}/api/food/like`, { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
    }

    async function saveVideo(item) {
        const response = await axios.post(`${API_BASE_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <div className="home-container">
            {/* Header with Login/Signup */}
            <Header />
            
            {/* Feed Tabs */}
            <div className="feed-tabs">
                <button 
                    className={`feed-tab ${activeTab === 'foryou' ? 'active' : ''}`}
                    onClick={() => setActiveTab('foryou')}
                >
                    For You
                </button>
                <button 
                    className={`feed-tab ${activeTab === 'following' ? 'active' : ''}`}
                    onClick={() => setActiveTab('following')}
                >
                    Following
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loader"></div>
                </div>
            ) : (
                <ReelFeed
                    items={videos}
                    onLike={likeVideo}
                    onSave={saveVideo}
                    emptyMessage={activeTab === 'following' 
                        ? "Follow food partners to see their content here!" 
                        : "No videos available."
                    }
                />
            )}
        </div>
    )
}

export default Home