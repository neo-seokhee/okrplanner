
export type GoalType = 'NUMERIC' | 'BOOLEAN';

export type RecordStatus = 'SUCCESS' | 'FAIL' | 'HOLD';

export interface Category {
  id: string;
  name: string;
  color: string;
  orderIndex?: number;
}

export interface Goal {
  id: string;
  categoryId: string;
  year: number;
  emoji: string;
  title: string;
  description?: string; // Optional description, max 100 chars
  type: GoalType;
  targetValue?: number; // e.g., 10 (books), 100 (kg)
  unit?: string; // e.g., "books", "kg"
  orderIndex?: number;
}

export interface MonthlyRecord {
  id: string;
  goalId: string;
  year: number;
  month: number; // 1-12
  numericValue?: number;
  status?: RecordStatus; // 3-state status
  // Legacy field for backward compatibility
  achieved?: boolean;
}

export interface Retrospective {
  id: string;
  year: number;
  month: number;
  content: string;
}

export interface Resolution {
  id: string;
  year: number;
  content: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  profile_photo_url?: string;
}

export interface AppState {
  currentUser: User | null;
  selectedYear: number;
  activeTab: 'GOALS' | 'RECORDS' | 'SETTINGS';
}