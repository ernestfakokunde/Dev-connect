import React, { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import FacebookNavbar from '../components/FacebookNavbar';
import PostCard from '../components/PostCard';
import { FaImage, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import formatTime from '../utils/formatTime';
import { getImageUrl, DEFAULT_AVATAR } from '../utils/imageUtils';

const Feed = () => {
  const { user, token } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 5;
  const observerTarget = useRef(null);

  useEffect(() => {
    if (token) {
      fetchPosts(0, true);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          console.log('Loading more posts...');
          fetchPosts(page + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [page, hasMore, loadingMore, loading]);

  const fetchPosts = async (pageNum, isInitial) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      console.log(`Fetching posts page ${pageNum} with token:`, token ? 'Token exists' : 'No token');
      const response = await axiosInstance.get('/posts');
      let allPosts = response.data || [];
      
      // Shuffle posts for randomness
      allPosts = allPosts.sort(() => Math.random() - 0.5);
      
      // Paginate: get postsPerPage starting from page offset
      const startIdx = pageNum * postsPerPage;
      const endIdx = startIdx + postsPerPage;
      const paginatedPosts = allPosts.slice(startIdx, endIdx);
      
      console.log(`Posts page ${pageNum}: got ${paginatedPosts.length} posts, total available: ${allPosts.length}`);
      
      if (isInitial) {
        setPosts(paginatedPosts);
      } else {
        setPosts((prev) => [...prev, ...paginatedPosts]);
      }
      
      setPage(pageNum);
      // If we got fewer posts than requested, we've reached the end
      setHasMore(paginatedPosts.length === postsPerPage);
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 401) {
        toast.error('Please log in to view posts');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please complete your profile.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load posts');
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostImages((prev) => [...prev, ...files]);
    
    // Create previews for new images
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postText.trim() && postImages.length === 0) {
      toast.error('Post cannot be empty');
      return;
    }

    if (!token) {
      toast.error('Please log in to create a post');
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('text', postText);
      // Append all images with 'images' field name (plural) to match backend multer config
      postImages.forEach((image) => {
        formData.append('images', image);
      });

      console.log('Creating post with:', { text: postText, imageCount: postImages.length });
      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data);
      // Add new post to the top without refreshing
      setPosts([response.data, ...posts]);
      setPostText('');
      setPostImages([]);
      setImagePreviews([]);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axiosInstance.patch(`/posts/like/${postId}`);
      // Update post likes locally without full refresh
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes?.includes(user?.id || user?._id)
                  ? post.likes.filter((id) => id !== (user?.id || user?._id))
                  : [...(post.likes || []), user?.id || user?._id],
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText.trim()) return;
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { text: commentText });
      // Add comment to post locally without full refresh
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), response.data],
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacebookNavbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post Form */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleCreatePost}>
              <div className="flex items-start space-x-3 text-black">
                <img
                  src={getImageUrl(user.profilePic)}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {e.target.src = DEFAULT_AVATAR}}
                />
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none text-black"
                    rows="3"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-2">
                      {imagePreviews.length === 1 ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[0]}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(0)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{imagePreviews.length} image(s) selected</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-[#1877F2]">
                      <FaImage />
                      <span>Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={creating}
                      className="bg-[#1a2a72] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1565C0] disabled:opacity-50"
                    >
                      {creating ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No posts yet. Be the first to post!
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={() => handleLike(post._id)}
                  onComment={(text) => handleComment(post._id, text)}
                  currentUser={user}
                  token={token}
                />
              ))}
              
              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="py-8 text-center">
                {loadingMore && (
                  <div className="text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1877F2]"></div>
                    <p className="mt-2">Loading more posts...</p>
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-gray-400">No more posts to load</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
