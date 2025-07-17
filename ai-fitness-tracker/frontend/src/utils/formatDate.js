/**
 * Date formatting utilities for the fitness tracker app
 */

export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

export const formatTime = (dateString, options = {}) => {
  const date = new Date(dateString);
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return date.toLocaleTimeString('en-US', defaultOptions);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  return formatDate(dateString);
};

export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatWorkoutDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // If within the last week, show day of week
  const diffInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  return formatDate(dateString);
};

export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isThisWeek = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return date >= startOfWeek;
};

export const getWeekRange = (date = new Date()) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { start: startOfWeek, end: endOfWeek };
};

export const getMonthRange = (date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return { start: startOfMonth, end: endOfMonth };
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatWorkoutDate,
  isToday,
  isThisWeek,
  getWeekRange,
  getMonthRange
};