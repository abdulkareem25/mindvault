export const CATEGORIES = {
  CODING: 'coding',
  DEEN: 'deen',
  ADMIN: 'admin',
  LIFE: 'life',
};

export const MEMORY_TYPES = {
  DECISION: 'decision',
  PREFERENCE: 'preference',
  LEARNING: 'learning',
  GOAL: 'goal',
  FACT: 'fact',
};

export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
