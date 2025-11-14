// Custom types for SQLite string-based enums
export type EventType = 'SUCCESS' | 'FAILURE' | 'SOCIAL' | 'FINANCIAL' | 'INTERNAL' | 'IDEA' | 'CONFLICT';
export type EventCategory = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type ProfileStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export const EVENT_TYPES: EventType[] = ['SUCCESS', 'FAILURE', 'SOCIAL', 'FINANCIAL', 'INTERNAL', 'IDEA', 'CONFLICT'];
export const EVENT_CATEGORIES: EventCategory[] = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];
export const PROFILE_STATUSES: ProfileStatus[] = ['ACTIVE', 'PAUSED', 'COMPLETED'];
