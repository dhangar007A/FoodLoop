import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Following = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFollowingFeed()
    }, [])

    async function fetchFollowingFeed() {
        try {
            const response = await axios.get('http://localhost:3000/api/user/following-feed', {
                withCredentials: true
            })
            setVideos(response.data.videos || [])
        } catch (error) {
            console.error('Error fetching following feed:', error)
        } finally {
            setLoading(false)
        }
    }

    async function likeVideo(item) {
        const response = await axios.post('http://localhost:3000/api/food/like', { foodId: item._id }, { withCredentials: true })
        
        if (response.data.like) {
            setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        } else {
            setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
    }

    async function saveVideo(item) {
        const response = await axios.post('http://localhost:3000/api/food/save', { foodId: item._id }, { withCredentials: true })
        
        if (response.data.save) {
            setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        } else {
            setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    if (loading) {
        return <div className="loading-screen">Loading...</div>
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="Follow some restaurants to see their latest posts here!"
        />
    )
}

export default Following
