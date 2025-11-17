import api from "./axiosInstance";

export const fetchConversations = () => api.get("/api/messages/conversations");
export const fetchMessages = (otherId) => api.get(`/api/messages/${otherId}`);
export const postMessage = (formData) => api.post("/api/messages", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const markAsRead = (otherId) => api.patch(`/api/messages/read/${otherId}`);
export const fetchSharedMedia = (otherId) => api.get(`/api/messages/${otherId}/media`);
//marks messages as read when user views the chat
