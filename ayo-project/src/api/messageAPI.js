import api from "./axiosInstance";

export const fetchConversations = () => api.get("/messages/conversations");
export const fetchMessages = (otherId) => api.get(`/messages/${otherId}`);
export const postMessage = (formData) => api.post("/messages", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const markAsRead = (otherId) => api.patch(`/messages/read/${otherId}`);
export const fetchSharedMedia = (otherId) => api.get(`/messages/${otherId}/media`);
//marks messages as read when user views the chat