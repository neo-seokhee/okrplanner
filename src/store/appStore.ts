import { create } from 'zustand';
import { Year, Goal, Category, MonthlyRecord, MonthlyReview } from '../types';

interface AppState {
  years: Year[];
  goals: Goal[];
  categories: Category[];
  monthlyRecords: MonthlyRecord[];
  monthlyReviews: MonthlyReview[];
  selectedYearId: string | null;

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
