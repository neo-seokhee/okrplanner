import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Tag, Target, Edit2, BarChart2, X, Check, Smile, Minus, PenTool, Quote, Bold, List, ListOrdered, MessageSquareQuote, GripVertical, Italic, Indent, Outdent } from 'lucide-react';
import { Goal, Category, User, MonthlyRecord, RecordStatus, Resolution } from '../types';
import * as db from '../services/storageService';
import { DEMO_GOALS, DEMO_CATEGORIES, DEMO_RECORDS, DEMO_RESOLUTION } from '../demoData';
import { Modal } from './ui/Modal';
import { LoginPromptModal } from './LoginPromptModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  user: User;
  year: number;
  isDemoMode?: boolean;
}

const PRESET_EMOJIS = ['🎯', '📚', '🏃', '💰', '💊', '📝', '📅', '🥗', '💧', '🧠', '✈️', '💻', '🎨', '🎵', '🏠', '💪', '🌱', '🎓', '💸', '🧘', '⭐️', '🔥', '🌈', '⏰', '🛌'];

// Sortable Item Components
const SortableGoalItem = ({ goal, onClick, stats }: { goal: Goal; onClick: () => void; stats: any }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group flex items-center gap-3 ${isDragging ? 'shadow-lg ring-2 ring-indigo-500' : ''}`}
    >
      {/* Drag Handle - Left Side */}
      <div {...attributes} {...listeners} className="text-gray-300 cursor-grab active:cursor-grabbing p-0.5 -ml-1 touch-none flex-shrink-0 hover:text-gray-500 transition-colors">
        <GripVertical size={14} />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <span className="text-3xl bg-gray-50 p-2 rounded-lg flex-shrink-0">{goal.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">{goal.title}</h4>
          {goal.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{goal.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={`text-xs px-3 py-1.5 rounded-lg font-bold ${stats.color}`}>
          {stats.label}
        </div>
      </div>
    </div>
  );
};

const SortableCategoryItem = ({ cat, onEdit, onDelete }: { cat: Category; onEdit: () => void; onDelete: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 ${isDragging ? 'shadow-md ring-2 ring-indigo-500' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="text-gray-400 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${cat.color}`}>
          {cat.name}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-gray-400 hover:text-indigo-600">
          <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export const GoalManager: React.FC<Props> = ({ user, year, isDemoMode = false }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [resolution, setResolution] = useState<string>('');

  // Modal States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  // UI States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isManualEmoji, setIsManualEmoji] = useState(false);
  const [isEditingResolution, setIsEditingResolution] = useState(false);

  // Selection State
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Form State
  const [editingGoal, setEditingGoal] = useState<Partial<Goal>>({});

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [isEditingCategoryMode, setIsEditingCategoryMode] = useState(false);

  // Refs
  const resolutionEditorRef = useRef<HTMLDivElement>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEndGoal = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex) as Goal[];

        // Save new order to DB
        db.reorderGoals(user.id, newOrder);
        return newOrder;
      });
    }
  };

  const handleDragEndCategory = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex) as Category[];

        // Save new order to DB
        db.reorderCategories(user.id, newOrder);
        return newOrder;
      });
    }
  };

  const COLORS = [
    'bg-red-100 text-red-700', 'bg-orange-100 text-orange-700', 'bg-amber-100 text-amber-700',
    'bg-green-100 text-green-700', 'bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700', 'bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700', 'bg-purple-100 text-purple-700', 'bg-fuchsia-100 text-fuchsia-700',
    'bg-pink-100 text-pink-700', 'bg-rose-100 text-rose-700', 'bg-gray-100 text-gray-700'
  ];

  useEffect(() => {
    if (isDemoMode) {
      // Use demo data
      setGoals(DEMO_GOALS);
      setCategories(DEMO_CATEGORIES);
      setRecords(DEMO_RECORDS);
      setResolution(DEMO_RESOLUTION);
    } else {
      loadData();
    }
  }, [user.id, year, isDemoMode]);

  const loadData = async () => {
    try {
      const [cats, userGoals, userRecords, res] = await Promise.all([
        db.getCategories(user.id),
        db.getGoals(user.id, year),
        db.getYearRecords(user.id, year),
        db.getResolution(user.id, year)
      ]);
      setCategories(cats);
      setGoals(userGoals);
      setRecords(userRecords);
      setResolution(res ? res.content : '');
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // --- Resolution Logic ---

  const handleSaveResolution = async () => {
    const content = resolutionEditorRef.current?.innerHTML || '';
    setResolution(content);

    const res: Resolution = {
      id: crypto.randomUUID(),
      year,
      content: content
    };
    await db.saveResolution(user.id, res);
    setIsEditingResolution(false);
  };

  // Editor Command Helper
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    resolutionEditorRef.current?.focus();
  };

  // --- Category Logic ---

  const handleSaveCategory = async () => {
    if (!editingCategory.name?.trim()) return;
    const newCat: Category = {
      id: editingCategory.id || crypto.randomUUID(),
      name: editingCategory.name,
      color: editingCategory.color || 'bg-blue-100 text-blue-700'
    };
    await db.saveCategory(user.id, newCat);
    setEditingCategory({});
    setIsEditingCategoryMode(false);
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    const goalsInCat = goals.filter(g => g.categoryId === id);
    if (goalsInCat.length > 0) {
      alert('이 카테고리에 속한 목표가 있어 삭제할 수 없습니다. 목표를 먼저 삭제하거나 이동해주세요.');
      return;
    }
    if (confirm('이 카테고리를 삭제하시겠습니까?')) {
      await db.deleteCategory(user.id, id);
      loadData();
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsEditingCategoryMode(true);
  };

  // --- Goal Logic ---

  const handleSaveGoal = async () => {
    if (!editingGoal.title || !editingGoal.categoryId) return;

    const goalToSave: Goal = {
      id: editingGoal.id || crypto.randomUUID(),
      year,
      categoryId: editingGoal.categoryId,
      emoji: editingGoal.emoji || '🎯',
      title: editingGoal.title,
      description: editingGoal.description,
      type: editingGoal.type || 'BOOLEAN',
      targetValue: editingGoal.targetValue,
      unit: editingGoal.unit
    };

    await db.saveGoal(user.id, goalToSave);
    setShowGoalModal(false);
    setShowEmojiPicker(false);
    setIsManualEmoji(false);

    if (selectedGoal && selectedGoal.id === goalToSave.id) {
      setSelectedGoal(goalToSave);
    }

    setEditingGoal({});
    loadData();
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('정말로 이 목표를 삭제하시겠습니까? 관련 기록도 함께 삭제되지 않습니다.')) {
      await db.deleteGoal(user.id, id);
      setDetailModalOpen(false);
      setSelectedGoal(null);
      loadData();
    }
  };

  const openNewGoalModal = () => {
    if (isDemoMode) {
      setShowLoginPrompt(true);
      return;
    }
    setEditingGoal({
      emoji: '🎯',
      type: 'BOOLEAN',
      categoryId: categories[0]?.id || ''
    });
    setShowGoalModal(true);
    setShowEmojiPicker(false);
    setIsManualEmoji(false);
  };

  const openGoalDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setDetailModalOpen(true);
  };

  const switchToEditMode = () => {
    if (!selectedGoal) return;
    setEditingGoal(selectedGoal);
    setDetailModalOpen(false);
    setGoalModalOpen(true);
    setShowEmojiPicker(false);
  };

  // --- Helper Functions ---

  const getRecordStatus = (record: MonthlyRecord | undefined): RecordStatus | undefined => {
    if (!record) return undefined;
    // Backward compatibility
    if (record.status) return record.status;
    if (record.achieved === true) return 'SUCCESS';
    if (record.achieved === false) return 'FAIL';
    return undefined;
  };

  const getLatestStatus = (goalId: string, type: 'NUMERIC' | 'BOOLEAN', unit?: string) => {
    const goalRecords = records.filter(r => r.goalId === goalId);
    const goal = goals.find(g => g.id === goalId);

    if (goalRecords.length === 0) return { label: '기록 없음', color: 'text-gray-400 bg-gray-50' };

    // Sort by month descending
    const sorted = goalRecords.sort((a, b) => b.month - a.month);
    const latest = sorted[0];

    if (type === 'BOOLEAN') {
      const status = getRecordStatus(latest);
      if (status === 'SUCCESS') return { label: '달성', color: 'text-green-600 bg-green-50' };
      if (status === 'FAIL') return { label: '실패', color: 'text-red-500 bg-red-50' };
      if (status === 'HOLD') return { label: '보류', color: 'text-amber-500 bg-amber-50' };
      return { label: '기록 없음', color: 'text-gray-400 bg-gray-50' };
    } else {
      // Numeric type - calculate total progress and show percentage
      const totalValue = goalRecords.reduce((sum, r) => sum + (r.numericValue || 0), 0);
      const targetValue = goal?.targetValue || 0;

      if (targetValue > 0) {
        const percentage = Math.round((totalValue / targetValue) * 100);
        const percentColor = percentage >= 100
          ? 'text-green-600 bg-green-50'
          : percentage >= 50
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-amber-600 bg-amber-50';
        return {
          label: `${percentage}%`,
          color: percentColor
        };
      } else {
        // No target set, just show current total
        return {
          label: `${totalValue}${unit || ''}`,
          color: 'text-indigo-600 bg-indigo-50'
        };
      }
    }
  };

  const getMonthlyStatusColor = (goalId: string, month: number) => {
    const record = records.find(r => r.goalId === goalId && r.month === month);
    if (!record) return 'bg-gray-100 border-gray-200 text-gray-400';

    const goal = goals.find(g => g.id === goalId);
    if (goal?.type === 'BOOLEAN') {
      const status = getRecordStatus(record);
      if (status === 'SUCCESS') return 'bg-green-100 border-green-200 text-green-700 font-bold';
      if (status === 'FAIL') return 'bg-red-50 border-red-100 text-red-300';
      if (status === 'HOLD') return 'bg-amber-50 border-amber-100 text-amber-500 font-bold';
    }
    return 'bg-indigo-100 border-indigo-200 text-indigo-700 font-bold';
  };

  const getMonthlyStatusIcon = (goalId: string, month: number) => {
    const record = records.find(r => r.goalId === goalId && r.month === month);
    if (!record) return <span className="text-xs">-</span>;

    const goal = goals.find(g => g.id === goalId);
    if (goal?.type === 'NUMERIC') {
      return <span className="text-xs">{record.numericValue}</span>;
    } else {
      const status = getRecordStatus(record);
      if (status === 'SUCCESS') return <Check size={14} />;
      if (status === 'FAIL') return <X size={14} />;
      if (status === 'HOLD') return <Minus size={14} />;
      return <span className="text-xs">-</span>;
    }
  };

  return (
    <div className="pb-24">
      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          // Navigate to settings/auth - this will be handled by App.tsx
          window.location.reload(); // Temporary solution to trigger auth flow
        }}
      />

      {/* Header Actions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={openNewGoalModal}
          className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition active:scale-95 text-sm font-medium"
        >
          <Plus size={18} /> 새 목표
        </button>
        <button
          onClick={() => {
            if (isDemoMode) {
              setShowLoginPrompt(true);
            } else {
              setIsEditingCategoryMode(false);
              setEditingCategory({});
              setShowCategoryModal(true);
            }
          }}
          className="flex-shrink-0 flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition active:scale-95 text-sm font-medium"
        >
          <Tag size={18} /> 카테고리 관리
        </button>
      </div>

      {/* Resolution Card */}
      <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 p-4 rounded-2xl border border-indigo-100 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            {year}년의 다짐
          </label>
        </div>

        {isEditingResolution ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <div className="bg-gray-50 px-2 py-2 border-b border-gray-200 text-gray-500 flex gap-2 overflow-x-auto items-center justify-between">
              {/* Save button on the left */}
              <button
                onClick={handleSaveResolution}
                className="bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-1.5 text-xs flex-shrink-0"
              >
                저장
              </button>

              <div className="flex gap-2 items-center">
                <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="굵게 (Cmd+B)">
                  <Bold size={16} />
                </button>
                <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="이탤릭 (Cmd+I)">
                  <Italic size={16} />
                </button>
                <button onClick={() => execCommand('underline')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="밑줄 (Cmd+U)">
                  <span className="underline font-bold text-sm">U</span>
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                {/* Font Size Control */}
                <select
                  onChange={(e) => {
                    const size = e.target.value;
                    // Apply font size using the "font size 7" replacement hack
                    document.execCommand('fontSize', false, '7');
                    const fontElements = resolutionEditorRef.current?.querySelectorAll("font[size='7']");
                    fontElements?.forEach(el => {
                      el.removeAttribute("size");
                      el.style.fontSize = size;
                    });
                    // Also handle spans if browser uses styleWithCSS (Chrome sometimes does)
                    const spanElements = resolutionEditorRef.current?.querySelectorAll("span[style*='font-size: -webkit-xxx-large']");
                    spanElements?.forEach(el => {
                      el.style.fontSize = size;
                    });
                  }}
                  className="h-6 text-xs border border-gray-200 rounded px-1 text-gray-600 outline-none focus:border-indigo-500 bg-white w-16"
                  title="글자 크기"
                  defaultValue="14pt"
                >
                  {Array.from({ length: 23 }, (_, i) => i + 8).map(size => (
                    <option key={size} value={`${size}pt`}>{size}pt</option>
                  ))}
                </select>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="글머리 기호">
                  <List size={16} />
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="번호 매기기">
                  <ListOrdered size={16} />
                </button>
                <button onClick={() => execCommand('indent')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="들여쓰기">
                  <Indent size={16} />
                </button>
                <button onClick={() => execCommand('outdent')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="내어쓰기">
                  <Outdent size={16} />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <button
                  onClick={() => {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      const blockquote = document.createElement('blockquote');
                      blockquote.className = 'border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2';
                      try {
                        range.surroundContents(blockquote);
                      } catch {
                        blockquote.appendChild(range.extractContents());
                        range.insertNode(blockquote);
                      }
                    }
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                  title="인용"
                >
                  <MessageSquareQuote size={16} />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <div className="w-px h-4 bg-gray-300 mx-1" />
                {/* Color Pickers with Labels */}
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <input
                      type="color"
                      onChange={(e) => execCommand('foreColor', e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                      title="글자 색상"
                    />
                    <span className="absolute -bottom-3 left-0 right-0 text-center text-[8px] font-bold text-gray-600 pointer-events-none">T</span>
                  </div>
                  <div className="relative">
                    <input
                      type="color"
                      onChange={(e) => execCommand('hiliteColor', e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                      title="배경 색상"
                      defaultValue="#ffffff"
                    />
                    <span className="absolute -bottom-3 left-0 right-0 text-center text-[8px] font-bold text-gray-600 pointer-events-none">B</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={resolutionEditorRef}
              contentEditable
              className="w-full min-h-[150px] p-4 outline-none text-gray-900 leading-relaxed text-sm bg-white overflow-y-auto prose prose-sm max-w-none
                         prose-headings:font-bold prose-p:my-2
                         [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4
                         prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: resolution }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[60px] relative group cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsEditingResolution(true)}>
            {/* Edit Button Overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100 text-indigo-600">
              <Edit2 size={16} />
            </div>

            {resolution ? (
              <div
                className="prose prose-sm max-w-none text-gray-900 leading-relaxed
                           prose-headings:font-bold prose-p:my-2
                           [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4
                           prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500"
                dangerouslySetInnerHTML={{ __html: resolution }}
              />
            ) : (
              <p className="text-gray-400 italic text-center py-2">
                터치하여 다짐을 적어보세요.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Goal List by Category */}
      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>아직 카테고리가 없습니다. 하나 생성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(cat => {
            const catGoals = goals.filter(g => g.categoryId === cat.id);
            if (catGoals.length === 0) return null;

            return (
              <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${cat.color}`}>
                  {cat.name}
                </h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndGoal}
                >
                  <SortableContext
                    items={catGoals.map(g => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-3 grid-cols-1">
                      {catGoals.map(goal => {
                        const stats = getLatestStatus(goal.id, goal.type, goal.unit);
                        return (
                          <SortableGoalItem
                            key={goal.id}
                            goal={goal}
                            onClick={() => openGoalDetail(goal)}
                            stats={stats}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            );
          })}

          {/* Uncategorized Goals */}
          {goals.filter(g => !categories.find(c => c.id === g.categoryId)).length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-gray-200 text-gray-600">
                미분류
              </h3>
              <div className="grid gap-3 grid-cols-1">
                {goals.filter(g => !categories.find(c => c.id === g.categoryId)).map(goal => {
                  const stats = getLatestStatus(goal.id, goal.type, goal.unit);
                  return (
                    <div
                      key={goal.id}
                      onClick={() => openGoalDetail(goal)}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1" onClick={() => openGoalDetail(goal)}>
                        <span className="text-3xl bg-gray-50 p-2 rounded-lg">{goal.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          {goal.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{goal.description}</p>}
                        </div>
                      </div>
                      <div className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${stats.color}`}>
                        {stats.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {goals.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-indigo-50 text-indigo-500 p-4 rounded-full inline-block mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-gray-900 font-medium">{year}년 목표가 없습니다</h3>
              <p className="text-gray-500 text-sm mt-1">'새 목표' 버튼을 눌러 시작하세요.</p>
            </div>
          )}
        </div>
      )}

      {/* Goal Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} title="목표 상세">
        {selectedGoal && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedGoal.emoji}</div>
              <h2 className="text-xl font-bold text-gray-900">{selectedGoal.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {categories.find(c => c.id === selectedGoal.categoryId)?.name} •
                {selectedGoal.type === 'NUMERIC' ? ` 목표: ${selectedGoal.targetValue}${selectedGoal.unit}` : ' 매월 달성 목표'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">최근 현황</span>
              <div className="text-xl font-bold text-gray-900 mt-2">
                {(() => {
                  const stats = getLatestStatus(selectedGoal.id, selectedGoal.type, selectedGoal.unit);
                  return <span className={`${stats.color} bg-transparent px-0`}>{stats.label}</span>;
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart2 size={16} /> 월별 기록
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <div key={month} className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${getMonthlyStatusColor(selectedGoal.id, month)}`}>
                    <span className="text-[10px] mb-0.5">{month}월</span>
                    {getMonthlyStatusIcon(selectedGoal.id, month)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={switchToEditMode}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <Edit2 size={18} /> 수정
              </button>
              <button
                onClick={() => handleDeleteGoal(selectedGoal.id)}
                className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> 삭제
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Goal Form Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title={editingGoal.id ? '목표 수정' : '새 목표 만들기'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목표</label>
            <div className="flex gap-2 relative">
              <button
                onClick={() => {
                  if (isDemoMode) {
                    setShowLoginPrompt(true);
                  } else {
                    setShowEmojiPicker(!showEmojiPicker);
                    setIsManualEmoji(false);
                  }
                }}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 transition relative"
              >
                {editingGoal.emoji || <Smile size={20} className="text-gray-400" />}
              </button>

              {showEmojiPicker && (
                <div className="absolute top-14 left-0 p-3 bg-white rounded-xl shadow-xl border border-gray-200 z-50 w-64 animate-in fade-in zoom-in-95 duration-200">
                  {isManualEmoji ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 block">이모지 직접 입력</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-center"
                          placeholder="🚀"
                          maxLength={2}
                          onChange={(e) => setEditingGoal({ ...editingGoal, emoji: e.target.value })}
                        />
                        <button
                          onClick={() => setShowEmojiPicker(false)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"
                        >
                          확인
                        </button>
                      </div>
                      <button
                        onClick={() => setIsManualEmoji(false)}
                        className="text-xs text-gray-400 underline w-full text-center mt-2"
                      >
                        목록에서 선택하기
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-1">
                      {PRESET_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            if (isDemoMode) {
                              setShowLoginPrompt(true);
                            } else {
                              setEditingGoal({ ...editingGoal, emoji });
                              setShowEmojiPicker(false);
                            }
                          }}
                          className={`aspect-square flex items-center justify-center rounded hover:bg-gray-100 text-xl transition ${editingGoal.emoji === emoji ? 'bg-indigo-50 ring-1 ring-indigo-500' : ''}`}
                        >
                          {emoji}
                        </button>
                      ))}
                      {/* Direct Input Button */}
                      <button
                        onClick={() => setIsManualEmoji(true)}
                        className="aspect-square flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition"
                        title="직접 입력"
                      >
                        <PenTool size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <input
                type="text"
                value={editingGoal.title || ''}
                onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400"
                placeholder="목표 이름을 입력하세요"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명 (선택사항)</label>
            <textarea
              value={editingGoal.description || ''}
              onChange={(e) => {
                const value = e.target.value.slice(0, 100); // Limit to 100 chars
                setEditingGoal({ ...editingGoal, description: value });
              }}
              className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400 resize-none"
              placeholder="목표에 대한 간단한 설명을 입력하세요 (최대 100자)"
              rows={2}
              maxLength={100}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {(editingGoal.description || '').length}/100
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setEditingGoal({ ...editingGoal, categoryId: cat.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${editingGoal.categoryId === cat.id
                    ? 'ring-2 ring-offset-1 ring-gray-400 ' + cat.color
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">측정 방식</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEditingGoal({ ...editingGoal, type: 'BOOLEAN' })}
                className={`p-3 rounded-lg border text-sm font-medium text-center transition-colors ${editingGoal.type === 'BOOLEAN' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                성공 / 실패 / 보류
                <span className="block text-xs font-normal mt-1 opacity-70">단순 달성 여부</span>
              </button>
              <button
                onClick={() => setEditingGoal({ ...editingGoal, type: 'NUMERIC' })}
                className={`p-3 rounded-lg border text-sm font-medium text-center transition-colors ${editingGoal.type === 'NUMERIC' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                수치 기록
                <span className="block text-xs font-normal mt-1 opacity-70">횟수나 양 기록</span>
              </button>
            </div>
          </div>

          {editingGoal.type === 'NUMERIC' && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">목표치</label>
                <input
                  type="number"
                  value={editingGoal.targetValue || ''}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetValue: Number(e.target.value) })}
                  className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">단위</label>
                <input
                  type="text"
                  value={editingGoal.unit || ''}
                  onChange={(e) => setEditingGoal({ ...editingGoal, unit: e.target.value })}
                  className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  placeholder="권"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleSaveGoal}
              disabled={!editingGoal.title}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none hover:bg-indigo-700 transition"
            >
              목표 저장
            </button>
          </div>
        </div>
      </Modal>

      {/* Category Manager Modal */}
      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="카테고리 관리">
        <div className="space-y-6">
          {/* Category List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndCategory}
            >
              <SortableContext
                items={categories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map(cat => (
                  <SortableCategoryItem
                    key={cat.id}
                    cat={cat}
                    onEdit={() => startEditCategory(cat)}
                    onDelete={() => handleDeleteCategory(cat.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Add/Edit Form */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">{isEditingCategoryMode ? '카테고리 수정' : '새 카테고리 추가'}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">이름</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="예: 재테크"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">색상 태그</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setEditingCategory({ ...editingCategory, color: c })}
                      className={`w-6 h-6 rounded-full border-2 ${c.split(' ')[0]} ${editingCategory.color === c ? 'border-gray-600 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                {isEditingCategoryMode && (
                  <button
                    onClick={() => { setIsEditingCategoryMode(false); setEditingCategory({}); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
                  >
                    취소
                  </button>
                )}
                <button
                  onClick={handleSaveCategory}
                  disabled={!editingCategory.name}
                  className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isEditingCategoryMode ? '수정 완료' : '추가하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
