// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// 목표 타입
export interface Goal {
  id: string;
  yearId: string;
  categoryId: string;
  title: string;
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

// 월별 기록 타입
export interface MonthlyRecord {
  id: string;
  goalId: string;
  year: number;
  month: number;
  value: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 월별 회고 타입
export interface MonthlyReview {
  id: string;
  yearId: string;
  year: number;
  month: number;
  content: string;
  highlights?: string[];
  improvements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 연도 타입
export interface Year {
  id: string;
  year: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 네비게이션 타입
export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  GoalDetail: { goalId: string };
  MonthlyReview: { yearId: string; year: number; month: number };
};

export type MainTabParamList = {
  YearList: undefined;
  Dashboard: { yearId: string };
};
