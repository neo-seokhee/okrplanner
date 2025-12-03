import { Category, Goal, MonthlyRecord, Retrospective, User, Resolution } from '../types';
import { supabase } from './supabase';

// --- Auth ---

export const getSession = (): User | null => {
  // Session is handled by Supabase Auth listener in App.tsx
  // This helper might be redundant but keeping for compatibility if needed
  return null;
};

export const register = async (email: string, password: string, username: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('회원가입 실패');

  return {
    id: data.user.id,
    email: data.user.email,
    username: username
  };
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  if (!data.user) throw new Error('로그인 실패');

  return {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username || email.split('@')[0]
  };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

// --- Categories ---

export const getCategories = async (userId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  if (!data || data.length === 0) {
    // Default categories
    const defaults = [
      { name: '건강', color: 'bg-red-100 text-red-700' },
      { name: '커리어', color: 'bg-blue-100 text-blue-700' },
      { name: '자기개발', color: 'bg-green-100 text-green-700' },
    ];

    // Insert defaults
    const { data: newCats, error: insertError } = await supabase
      .from('categories')
      .insert(defaults.map(d => ({ user_id: userId, ...d })))
      .select();

    if (insertError) throw insertError;
    return newCats.map((c: any) => ({ ...c, orderIndex: c.order_index ?? 0 })) as Category[];
  }

  return data.map((c: any) => ({ ...c, orderIndex: c.order_index ?? 0 })) as Category[];
};

export const saveCategory = async (userId: string, category: Category) => {
  const { id, ...rest } = category;

  const payload: any = {
    user_id: userId,
    name: category.name,
    color: category.color,
  };

  // Only include order_index if it exists
  if (category.orderIndex !== undefined) {
    payload.order_index = category.orderIndex;
  }

  if (id && id.length > 10) {
    const { error } = await supabase
      .from('categories')
      .upsert({ id, ...payload });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('categories')
      .insert(payload);
    if (error) throw error;
  }
};

export const reorderCategories = async (userId: string, categories: Category[]) => {
  const updates = categories.map((c, index) => ({
    id: c.id,
    user_id: userId,
    name: c.name,
    color: c.color,
    order_index: index
  }));

  const { error } = await supabase
    .from('categories')
    .upsert(updates);

  if (error) throw error;
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  if (error) throw error;
};

// --- Goals ---

export const getGoals = async (userId: string, year: number): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('year', year)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Map DB fields to Frontend fields if necessary (snake_case to camelCase)
  return data.map((g: any) => ({
    id: g.id,
    categoryId: g.category_id,
    year: g.year,
    emoji: g.emoji,
    title: g.title,
    description: g.description,
    type: g.type,
    targetValue: g.target_value,
    unit: g.unit,
    orderIndex: g.order_index ?? 0
  }));
};

export const saveGoal = async (userId: string, goal: Goal) => {
  const payload: any = {
    id: goal.id,
    user_id: userId,
    category_id: goal.categoryId,
    year: goal.year,
    emoji: goal.emoji,
    title: goal.title,
    description: goal.description,
    type: goal.type,
    target_value: goal.targetValue,
    unit: goal.unit,
  };

  // Only include order_index if it exists
  if (goal.orderIndex !== undefined) {
    payload.order_index = goal.orderIndex;
  }

  const { error } = await supabase
    .from('goals')
    .upsert(payload);

  if (error) throw error;
};

export const reorderGoals = async (userId: string, goals: Goal[]) => {
  const updates = goals.map((g, index) => ({
    id: g.id,
    user_id: userId,
    category_id: g.categoryId,
    year: g.year,
    emoji: g.emoji,
    title: g.title,
    type: g.type,
    target_value: g.targetValue,
    unit: g.unit,
    order_index: index
  }));

  const { error } = await supabase
    .from('goals')
    .upsert(updates);

  if (error) throw error;
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);
  if (error) throw error;
};

// --- Records ---

export const getRecords = async (userId: string, year: number, month: number): Promise<MonthlyRecord[]> => {
  const { data, error } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('year', year)
    .eq('month', month);

  if (error) throw error;

  return data.map((r: any) => ({
    id: r.id,
    goalId: r.goal_id,
    year: r.year,
    month: r.month,
    numericValue: r.numeric_value,
    status: r.status,
    achieved: r.achieved
  }));
};

export const getYearRecords = async (userId: string, year: number): Promise<MonthlyRecord[]> => {
  const { data, error } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('year', year);

  if (error) throw error;

  return data.map((r: any) => ({
    id: r.id,
    goalId: r.goal_id,
    year: r.year,
    month: r.month,
    numericValue: r.numeric_value,
    status: r.status,
    achieved: r.achieved
  }));
};

export const saveRecord = async (userId: string, record: MonthlyRecord) => {
  // Check if exists to determine ID, or just upsert based on unique constraint (user_id, goal_id, year, month)
  // Our schema has unique constraint.

  const payload = {
    user_id: userId,
    goal_id: record.goalId,
    year: record.year,
    month: record.month,
    numeric_value: record.numericValue,
    status: record.status,
    achieved: record.achieved
  };

  // We need to handle the ID. If it's a new record from frontend, it might have a temp ID.
  // Best to query by unique keys or just let upsert handle it if we don't provide ID.
  // However, frontend expects an ID back usually, or uses the one it generated.
  // Let's try upserting.

  const { error } = await supabase
    .from('monthly_records')
    .upsert(payload, { onConflict: 'user_id, goal_id, year, month' });

  if (error) throw error;
};

// --- Retrospectives ---

export const getRetrospective = async (userId: string, year: number, month: number): Promise<Retrospective | null> => {
  const { data, error } = await supabase
    .from('retrospectives')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"
  if (!data) return null;

  return {
    id: data.id,
    year: data.year,
    month: data.month,
    content: data.content
  };
};

export const saveRetrospective = async (userId: string, retro: Retrospective) => {
  const payload = {
    user_id: userId,
    year: retro.year,
    month: retro.month,
    content: retro.content
  };

  const { error } = await supabase
    .from('retrospectives')
    .upsert(payload, { onConflict: 'user_id, year, month' });

  if (error) throw error;
};

// --- Resolutions ---

export const getResolution = async (userId: string, year: number): Promise<Resolution | null> => {
  const { data, error } = await supabase
    .from('resolutions')
    .select('*')
    .eq('year', year)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  return {
    id: data.id,
    year: data.year,
    content: data.content
  };
};

export const saveResolution = async (userId: string, resolution: Resolution) => {
  const payload = {
    user_id: userId,
    year: resolution.year,
    content: resolution.content
  };

  const { error } = await supabase
    .from('resolutions')
    .upsert(payload, { onConflict: 'user_id, year' });

  if (error) throw error;
};

// --- Backup & Restore (Migration) ---

export const exportAllData = async (userId: string) => {
  // Fetch all data from Supabase
  const [cats, goals, records, retros, resols] = await Promise.all([
    getCategories(userId),
    supabase.from('goals').select('*').eq('user_id', userId),
    supabase.from('monthly_records').select('*').eq('user_id', userId),
    supabase.from('retrospectives').select('*').eq('user_id', userId),
    supabase.from('resolutions').select('*').eq('user_id', userId)
  ]);

  const data = {
    categories: cats,
    goals: goals.data || [],
    records: records.data || [],
    retrospectives: retros.data || [],
    resolutions: resols.data || []
  };

  return JSON.stringify(data);
};

export const importAllData = async (jsonString: string, userId: string) => {
  try {
    const data = JSON.parse(jsonString);

    // Handle legacy LocalStorage format
    // Format was: { ls_categories: {...}, ls_goals: {...} } where values are { userId: [data] }

    let categories = [];
    let goals = [];
    let records = [];
    let retrospectives = [];
    let resolutions = [];

    // Check if it's the old format (keys start with ls_)
    if (data.ls_categories || data.ls_goals) {
      // Extract data for the current user (or all users? No, we only import for current user)
      // Wait, the old exportAllData exported EVERYTHING for ALL users in LocalStorage.
      // We should try to find data that looks like it belongs to the user, OR just import everything and assign to current user?
      // The old format: { "ls_goals": "{\"user-uuid\": [...]}" }

      const parseLegacy = (key: string) => {
        if (!data[key]) return [];
        const parsed = JSON.parse(data[key]);
        // Return all items flattened, or just the first user's?
        // Since we are migrating, we probably want to import ALL data found in the backup and assign it to the CURRENT user.
        return Object.values(parsed).flat();
      };

      categories = parseLegacy('ls_categories');
      goals = parseLegacy('ls_goals');
      records = parseLegacy('ls_records');
      retrospectives = parseLegacy('ls_retrospectives');
      resolutions = parseLegacy('ls_resolutions');
    } else {
      // New format or direct arrays
      categories = data.categories || [];
      goals = data.goals || [];
      records = data.records || [];
      retrospectives = data.retrospectives || [];
      resolutions = data.resolutions || [];
    }

    // Insert into Supabase
    // We need to map fields to snake_case

    if (categories.length) {
      await supabase.from('categories').upsert(categories.map((c: any) => ({
        id: c.id,
        user_id: userId,
        name: c.name,
        color: c.color
      })));
    }

    if (goals.length) {
      await supabase.from('goals').upsert(goals.map((g: any) => ({
        id: g.id,
        user_id: userId,
        category_id: g.categoryId || g.category_id,
        year: g.year,
        emoji: g.emoji,
        title: g.title,
        type: g.type,
        target_value: g.targetValue || g.target_value,
        unit: g.unit
      })));
    }

    if (records.length) {
      await supabase.from('monthly_records').upsert(records.map((r: any) => ({
        id: r.id,
        user_id: userId,
        goal_id: r.goalId || r.goal_id,
        year: r.year,
        month: r.month,
        numeric_value: r.numericValue || r.numeric_value,
        status: r.status,
        achieved: r.achieved
      })), { onConflict: 'user_id, goal_id, year, month' });
    }

    if (retrospectives.length) {
      await supabase.from('retrospectives').upsert(retrospectives.map((r: any) => ({
        id: r.id,
        user_id: userId,
        year: r.year,
        month: r.month,
        content: r.content
      })), { onConflict: 'user_id, year, month' });
    }

    if (resolutions.length) {
      await supabase.from('resolutions').upsert(resolutions.map((r: any) => ({
        id: r.id,
        user_id: userId,
        year: r.year,
        content: r.content
      })), { onConflict: 'user_id, year' });
    }

    return true;
  } catch (e) {
    console.error("Import failed", e);
    return false;
  }
};