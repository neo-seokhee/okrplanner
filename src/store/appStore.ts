import { create } from 'zustand';
import { Year, Goal, Category, MonthlyRecord, MonthlyReview } from '../types';

interface AppState {
  years: Year[];
  goals: Goal[];
  categories: Category[];
  monthlyRecords: MonthlyRecord[];
  monthlyReviews: MonthlyReview[];
  selectedYearId: string | null;
  initialized: boolean;

  // Initialization
  initializeApp: () => void;

  // Years
  addYear: (year: Omit<Year, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateYear: (id: string, data: Partial<Year>) => void;
  deleteYear: (id: string) => void;
  setSelectedYear: (yearId: string) => void;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Monthly Records
  addMonthlyRecord: (record: Omit<MonthlyRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMonthlyRecord: (id: string, data: Partial<MonthlyRecord>) => void;

  // Monthly Reviews
  addMonthlyReview: (review: Omit<MonthlyReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMonthlyReview: (id: string, data: Partial<MonthlyReview>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  years: [],
  goals: [],
  categories: [],
  monthlyRecords: [],
  monthlyReviews: [],
  selectedYearId: null,
  initialized: false,

  // Initialization
  initializeApp: () =>
    set((state) => {
      if (state.initialized) return state;

      const currentYear = new Date().getFullYear();
      const newYears: Year[] = [];
      const newCategories: Category[] = [];

      // 현재 연도부터 향후 2년까지 자동 생성
      for (let i = 0; i < 3; i++) {
        const year = currentYear + i;
        newYears.push({
          id: `year-${year}`,
          year,
          title: `${year}년 목표`,
          isActive: i === 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 기본 카테고리 생성
      const defaultCategories = [
        { name: '건강', color: '#4CAF50', icon: 'heart' },
        { name: '커리어', color: '#2196F3', icon: 'briefcase' },
        { name: '학습', color: '#FF9800', icon: 'book' },
        { name: '재정', color: '#9C27B0', icon: 'currency-usd' },
        { name: '관계', color: '#E91E63', icon: 'account-group' },
        { name: '취미', color: '#00BCD4', icon: 'palette' },
      ];

      defaultCategories.forEach((cat, index) => {
        newCategories.push({
          id: `category-${index + 1}`,
          ...cat,
        });
      });

      return {
        ...state,
        years: newYears,
        categories: newCategories,
        selectedYearId: newYears[0]?.id || null,
        initialized: true,
      };
    }),

  // Years
  addYear: (yearData) =>
    set((state) => ({
      years: [
        ...state.years,
        {
          ...yearData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateYear: (id, data) =>
    set((state) => ({
      years: state.years.map((year) =>
        year.id === id ? { ...year, ...data, updatedAt: new Date() } : year
      ),
    })),

  deleteYear: (id) =>
    set((state) => ({
      years: state.years.filter((year) => year.id !== id),
    })),

  setSelectedYear: (yearId) => set({ selectedYearId: yearId }),

  // Goals
  addGoal: (goalData) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goalData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateGoal: (id, data) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...data, updatedAt: new Date() } : goal
      ),
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    })),

  // Categories
  addCategory: (categoryData) =>
    set((state) => ({
      categories: [
        ...state.categories,
        {
          ...categoryData,
          id: Date.now().toString(),
        },
      ],
    })),

  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...data } : category
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),

  // Monthly Records
  addMonthlyRecord: (recordData) =>
    set((state) => ({
      monthlyRecords: [
        ...state.monthlyRecords,
        {
          ...recordData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateMonthlyRecord: (id, data) =>
    set((state) => ({
      monthlyRecords: state.monthlyRecords.map((record) =>
        record.id === id ? { ...record, ...data, updatedAt: new Date() } : record
      ),
    })),

  // Monthly Reviews
  addMonthlyReview: (reviewData) =>
    set((state) => ({
      monthlyReviews: [
        ...state.monthlyReviews,
        {
          ...reviewData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateMonthlyReview: (id, data) =>
    set((state) => ({
      monthlyReviews: state.monthlyReviews.map((review) =>
        review.id === id ? { ...review, ...data, updatedAt: new Date() } : review
      ),
    })),
}));
