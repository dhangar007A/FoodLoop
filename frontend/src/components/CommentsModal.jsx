import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../config/api';
import '../styles/comments.css'

const CommentsModal = ({ isOpen, onClose, foodId, foodName }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && foodId) {
            fetchComments()
        }
    }, [isOpen, foodId])

    async function fetchComments() {
        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/api/comments/food/${foodId}`, {
                withCredentials: true
            })
            setComments(response.data.comments || [])
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const response = await axios.post(`${API_BASE_URL}/api/comments`, {
                foodId,
                text: newComment,
                parentCommentId: replyTo?._id
            }, { withCredentials: true })

            if (replyTo) {
                setComments(prev => prev.map(c => 
                    c._id === replyTo._id 
                        ? { ...c, replies: [...(c.replies || []), response.data.comment], totalReplies: (c.totalReplies || 0) + 1 }
                        : c
                ))
            } else {
                setComments(prev => [response.data.comment, ...prev])
            }

            setNewComment('')
            setReplyTo(null)
        } catch (error) {
            console.error('Error adding comment:', error)
        }
    }

    async function handleLikeComment(commentId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/comments/like`, {
                commentId
            }, { withCredentials: true })

            setComments(prev => prev.map(c => {
                if (c._id === commentId) {
                    return { ...c, likeCount: response.data.liked ? c.likeCount + 1 : c.likeCount - 1 }
                }
                return c
            }))
        } catch (error) {
            console.error('Error liking comment:', error)
        }
    }

    async function handleDeleteComment(commentId) {
        try {
            await axios.delete(`${API_BASE_URL}/api/comments/${commentId}`, {
                withCredentials: true
            })
            setComments(prev => prev.filter(c => c._id !== commentId))
        } catch (error) {
            console.error('Error deleting comment:', error)
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

    if (!isOpen) return null

    return (
        <div className="comments-overlay" onClick={onClose}>
            <div className="comments-modal" onClick={e => e.stopPropagation()}>
                <div className="comments-header">
                    <h2>Comments</h2>
                    <button className="comments-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="comments-list">
                    {loading ? (
                        <div className="comments-loading">Loading comments...</div>
                    ) : comments.length === 0 ? (
                        <div className="comments-empty">No comments yet. Be the first!</div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <div className="comment-avatar">
                                    {comment.user?.fullName?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.user?.fullName}</span>
                                        <span className="comment-time">{formatTime(comment.createdAt)}</span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                    <div className="comment-actions">
                                        <button onClick={() => handleLikeComment(comment._id)}>
                                            ❤️ {comment.likeCount || 0}
                                        </button>
                                        <button onClick={() => setReplyTo(comment)}>Reply</button>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies?.length > 0 && (
                                        <div className="comment-replies">
                                            {comment.replies.map(reply => (
                                                <div key={reply._id} className="comment reply">
                                                    <div className="comment-avatar small">
                                                        {reply.user?.fullName?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className="comment-content">
                                                        <div className="comment-header">
                                                            <span className="comment-author">{reply.user?.fullName}</span>
                                                            <span className="comment-time">{formatTime(reply.createdAt)}</span>
                                                        </div>
                                                        <p className="comment-text">{reply.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {comment.totalReplies > comment.replies.length && (
                                                <button className="view-more-replies">
                                                    View {comment.totalReplies - comment.replies.length} more replies
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form className="comments-input" onSubmit={handleSubmit}>
                    {replyTo && (
                        <div className="reply-indicator">
                            Replying to {replyTo.user?.fullName}
                            <button type="button" onClick={() => setReplyTo(null)}>✕</button>
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <button type="submit" disabled={!newComment.trim()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CommentsModal