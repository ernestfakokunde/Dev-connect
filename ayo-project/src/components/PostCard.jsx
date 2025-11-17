import React, { useState } from "react";
import formatTime from "../utils/formatTime";
import { FaHeart, FaComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import { getImageUrl, FALLBACK_POST_IMAGE, DEFAULT_AVATAR } from "../utils/imageUtils";

export default function PostCard({ post, onLike, onComment, currentUser, token }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((like) => like.toString() === currentUser?.id?.toString()) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleLike = async () => {
    if (onLike) {
      onLike();
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={getImageUrl(post.user?.profilePic || post.profilePic)}
              alt={post.user?.username || post.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {e.target.src = '/default-avatar.svg'}}
            />
            <div>
              <div className="font-semibold text-gray-900 text-base">
                {post.user?.username || post.username || "Unknown User"}
              </div>
              <div className="text-xs text-gray-500">{formatTime(post.createdAt)}</div>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FaEllipsisH />
          </button>
        </div>
      </div>

      {/* Post Content */}
      {post.text && (
        <div className="px-4 pb-3 text-gray-800 leading-relaxed">
          {post.text}
        </div>
      )}

      {/* Post Images */}
      {(() => {
        // Handle both array and string formats for images
        const images = Array.isArray(post.image) ? post.image : (post.image ? [post.image] : []);
        if (images.length === 0) return null;
        
        return (
        <div className="w-full">
          {images.length === 1 ? (
            <img
              src={getImageUrl(images[0])}
              alt="Post content"
              className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90"
              onClick={() => {
                setLightboxOpen(true);
                setLightboxIndex(0);
              }}
              onError={(e) => {e.target.src = FALLBACK_POST_IMAGE}}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {images.slice(0, 4).map((img, i) => (
                <div 
                  key={i} 
                  className="relative cursor-pointer hover:opacity-90"
                  onClick={() => {
                    setLightboxOpen(true);
                    setLightboxIndex(i);
                  }}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Post image ${i + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {e.target.src = FALLBACK_POST_IMAGE}}
                  />
                  {i === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl">
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        );
      })()}

      {/* Post Stats Bar */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            {likeCount > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <FaHeart className="text-white text-xs" />
                </div>
                <span>{likeCount}</span>
              </div>
            )}
            {post.comments?.length > 0 && (
              <span>{post.comments.length} comments</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 ${
              isLiked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaHeart className={`text-lg ${isLiked ? "fill-current animate-pulse" : ""}`} />
            <span className="font-semibold">Like</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <FaComment className="text-lg" />
            <span className="font-semibold">Comment</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200">
            <FaShare className="text-lg" />
            <span className="font-semibold">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <img
                    src={getImageUrl(comment.user?.profilePic)}
                    alt={comment.user?.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {e.target.src = DEFAULT_AVATAR}}
                  />
                  <div className="flex-1 bg-white rounded-lg px-3 py-2 shadow-sm">
                    <div className="font-semibold text-sm text-gray-900">
                      {comment.user?.username || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
            <img
              src={getImageUrl(currentUser?.profilePic)}
              alt={currentUser?.username}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => {e.target.src = '/default-avatar.svg'}}
            />
            <div className="flex-1 flex items-center bg-white rounded-full border border-gray-200 px-3 py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-[#1877F2] font-semibold text-sm hover:text-[#1565C0] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox Modal */}
      {(() => {
        const lightboxImages = Array.isArray(post.image) ? post.image : (post.image ? [post.image] : []);
        if (!lightboxOpen || lightboxImages.length === 0) return null;
        
        return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-screen flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <img
              src={getImageUrl(lightboxImages[lightboxIndex])}
              alt={`Full view ${lightboxIndex + 1}`}
              className="max-w-full max-h-screen object-contain"
              onError={(e) => {e.target.src = FALLBACK_POST_IMAGE}}
            />

            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors text-2xl w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>

            {/* Previous Button */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                className="absolute left-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                ❮
              </button>
            )}

            {/* Next Button */}
            {lightboxIndex < lightboxImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                className="absolute right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                ❯
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
