
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Bold,
  Italic,
  List,
  ListOrdered,
  Check,
  X,
  Minus,
  Indent,
  Outdent,
  MessageSquareQuote,
  Edit2
} from 'lucide-react';
import { User, Goal, MonthlyRecord, Retrospective, Category, RecordStatus } from '../types';
import * as db from '../services/storageService';
import { DEMO_GOALS, DEMO_CATEGORIES, DEMO_RECORDS, getDemoRetrospective } from '../demoData';
import { LoginPromptModal } from './LoginPromptModal';

// Numeric Input Component to handle local state
const NumericGoalInput = ({
  goal,
  record,
  onSave
}: {
  goal: Goal;
  record: MonthlyRecord | undefined;
  onSave: (value: number | undefined) => void;
}) => {
  const [value, setValue] = useState<string>('');

  // Sync with record when it changes externally (e.g. month change)
  useEffect(() => {
    if (record?.numericValue !== undefined && record?.numericValue !== null) {
      setValue(record.numericValue.toLocaleString());
    } else {
      setValue('');
    }
  }, [record]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow digits and one decimal point
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
      if (rawValue === '') {
        setValue('');
      } else {
        // Only format if it's a valid number and doesn't end with a dot (to allow typing decimal)
        if (!rawValue.endsWith('.')) {
          const parts = rawValue.split('.');
          parts[0] = Number(parts[0]).toLocaleString();
          setValue(parts.join('.'));
        } else {
          setValue(rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
      }
    }
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <span className="text-sm text-gray-600 font-medium">
        목표: <span className="text-indigo-600 font-bold text-base">{goal.targetValue?.toLocaleString()}</span> {goal.unit}
      </span>
      <div className="flex gap-2 items-center justify-end">
        <input
          type="text"
          inputMode="decimal"
          className="w-20 sm:w-24 bg-transparent border-b-2 border-gray-300 text-gray-900 px-2 py-1 outline-none focus:border-indigo-500 transition text-sm font-bold text-right"
          placeholder="0"
          value={value}
          onChange={handleChange}
        />
        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
          {goal.unit}
        </span>
        <button
          onClick={() => {
            const rawValue = value.replace(/,/g, '');
            const numVal = parseFloat(rawValue);
            onSave(isNaN(numVal) && rawValue === '' ? undefined : numVal);
          }}
          className="py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
        >
          기록
        </button>
      </div>
    </div>
  );
};

interface Props {
  user: User;
  year: number;
  isDemoMode?: boolean;
}

export const MonthlyRecordManager: React.FC<Props> = ({ user, year, isDemoMode = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [retrospectiveHtml, setRetrospectiveHtml] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditingRetro, setIsEditingRetro] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDemoMode) {
      // Use demo data filtered by current month
      setGoals(DEMO_GOALS);
      setCategories(DEMO_CATEGORIES);
      // Filter records for current month
      const monthRecords = DEMO_RECORDS.filter(r => r.month === currentMonth);
      setRecords(monthRecords);
      // Get retrospective for current month
      const retro = getDemoRetrospective(currentMonth);
      setRetrospectiveHtml(retro.content);
      setIsEditingRetro(false);
    } else {
      loadData();
    }
  }, [currentMonth, year, user.id, isDemoMode]);

  useEffect(() => {
    // Sync editor content when loaded from DB
    if (editorRef.current && isEditingRetro) { // Only sync if in editing mode
      if (editorRef.current.innerHTML !== retrospectiveHtml) {
        editorRef.current.innerHTML = retrospectiveHtml;
      }
    }
  }, [retrospectiveHtml, isEditingRetro]); // Add isEditingRetro to dependencies

  const loadData = async () => {
    try {
      const [userGoals, userCats, userRecords, retro] = await Promise.all([
        db.getGoals(user.id, year),
        db.getCategories(user.id),
        db.getRecords(user.id, year, currentMonth),
        db.getRetrospective(user.id, year, currentMonth)
      ]);
      setGoals(userGoals);
      setCategories(userCats);
      setRecords(userRecords);
      // Use saved HTML or empty string
      setRetrospectiveHtml(retro ? retro.content : '');
      setIsEditingRetro(!retro || retro.content === ''); // Start in edit mode if no retro exists or it's empty
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const updateRecord = async (goalId: string, updates: Partial<MonthlyRecord>) => {
    if (isDemoMode) return; // Prevent saving in demo mode

    const existing = records.find(r => r.goalId === goalId);
    const baseRecord: MonthlyRecord = existing || {
      id: crypto.randomUUID(),
      goalId,
      year,
      month: currentMonth,
    };

    const newRecord = { ...baseRecord, ...updates };
    await db.saveRecord(user.id, newRecord);
    setRecords(prev => {
      const idx = prev.findIndex(r => r.goalId === goalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRecord;
        return copy;
      }
      return [...prev, newRecord];
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRetroSave = async () => {
    if (isDemoMode) return; // Prevent saving in demo mode

    // Get HTML directly from editable div to ensure we save what is seen
    const content = editorRef.current?.innerHTML || '';

    const retro: Retrospective = {
      id: crypto.randomUUID(),
      year,
      month: currentMonth,
      content: content
    };
    await db.saveRetrospective(user.id, retro);
    setRetrospectiveHtml(content);
    setIsSaved(true);
    setIsEditingRetro(false);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Editor Command Helpers
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      execCommand('bold');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      execCommand('italic');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      execCommand('underline');
    }
  };

  const getRecordStatus = (record: MonthlyRecord | undefined): RecordStatus | undefined => {
    if (!record) return undefined;
    if (record.status) return record.status;
    if (record.achieved === true) return 'SUCCESS';
    if (record.achieved === false) return 'FAIL';
    return undefined;
  };

  const monthName = new Date(year, currentMonth - 1).toLocaleString('ko-KR', { month: 'long' });

  return (
    <div className="pb-24">
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          window.location.reload();
        }}
      />
      {/* Month Navigator */}
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur pt-2 pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => setCurrentMonth(m => m > 1 ? m - 1 : 12)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 w-32 text-center">{monthName}</h2>
          <button
            onClick={() => setCurrentMonth(m => m < 12 ? m + 1 : 1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Retrospective Note (WYSIWYG) - Moved to Top */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              회고 노트
            </h3>
          </div>

          {isEditingRetro ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <div className="bg-gray-50 px-2 py-2 border-b border-gray-200 text-gray-500 flex gap-2 overflow-x-auto items-center justify-between">
                {/* Save button on the left */}
                <button
                  onClick={handleRetroSave}
                  className="bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-1.5 text-xs flex-shrink-0"
                >
                  <Save size={14} /> {isSaved ? '저장됨' : '저장'}
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
                      const fontElements = editorRef.current?.querySelectorAll("font[size='7']");
                      fontElements?.forEach(el => {
                        el.removeAttribute("size");
                        el.style.fontSize = size;
                      });
                      // Also handle spans if browser uses styleWithCSS (Chrome sometimes does)
                      const spanElements = editorRef.current?.querySelectorAll("span[style*='font-size: -webkit-xxx-large']");
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
                ref={editorRef}
                contentEditable
                onKeyDown={handleKeyDown}
                className="w-full min-h-[200px] p-4 outline-none text-gray-900 leading-relaxed text-sm bg-white overflow-y-auto prose prose-sm max-w-none
                             prose-headings:font-bold prose-p:my-2
                             [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4
                             prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500"
                style={{ whiteSpace: 'pre-wrap' }}
                data-placeholder={`${monthName}은 어떠셨나요? 잘한 점과 아쉬운 점을 남겨보세요.`}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[60px] relative group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                if (isDemoMode) {
                  setShowLoginPrompt(true);
                  return;
                }
                setIsEditingRetro(true);
                // Wait for render then set content
                setTimeout(() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = retrospectiveHtml;
                  }
                }, 0);
              }}>
              {retrospectiveHtml ? (
                <div
                  className={`prose prose-sm max-w-none text-gray-900 leading-relaxed
                             prose-headings:font-bold prose-p:my-2
                             [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4
                             prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500
                             ${isDemoMode ? 'text-xs scale-[0.85] origin-top-left' : ''}`}
                  dangerouslySetInnerHTML={{ __html: retrospectiveHtml }}
                />
              ) : (
                <p className="text-gray-400 italic text-center py-4">
                  아직 작성된 회고가 없습니다.
                </p>
              )}

              <button
                onClick={() => {
                  setIsEditingRetro(true);
                  // Wait for render then set content
                  setTimeout(() => {
                    if (editorRef.current) {
                      editorRef.current.innerHTML = retrospectiveHtml;
                    }
                  }, 0);
                }}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-lg transition opacity-0 group-hover:opacity-100"
                title="수정"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Goals Evaluation */}
        <div>
          {/* Pending Goals Logic */}
          {(() => {
            const pendingGoals = goals.filter(goal => {
              const record = records.find(r => r.goalId === goal.id);
              const status = getRecordStatus(record);
              if (goal.type === 'BOOLEAN') {
                return !status;
              } else {
                return !record || record.numericValue === undefined || record.numericValue === null;
              }
            });

            if (pendingGoals.length === 0) return null;

            return (
              <>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  월간 점검
                </h3>

                <div className="space-y-3">
                  {pendingGoals.sort((a, b) => {
                    const catA = categories.find(c => c.id === a.categoryId);
                    const catB = categories.find(c => c.id === b.categoryId);
                    const catOrderA = catA?.orderIndex ?? 999;
                    const catOrderB = catB?.orderIndex ?? 999;
                    if (catOrderA !== catOrderB) return catOrderA - catOrderB;
                    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
                  }).map(goal => {
                    const record = records.find(r => r.goalId === goal.id);
                    const cat = categories.find(c => c.id === goal.categoryId);

                    return (
                      <div key={goal.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        {/* Header: Goal info and category */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex gap-3 items-start flex-1 min-w-0">
                            <div className="text-3xl flex-shrink-0">{goal.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900 text-base leading-tight">{goal.title}</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {cat && <span className={`text-[11px] px-3 py-1 rounded-full uppercase font-bold ${cat.color} whitespace-nowrap`}>{cat.name}</span>}
                          </div>
                        </div>

                        {/* Input Area */}
                        {goal.type === 'BOOLEAN' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateRecord(goal.id, { status: 'SUCCESS', achieved: true })}
                              className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition text-sm font-semibold bg-white border-2 border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-700"
                            >
                              <Check size={16} /> 달성
                            </button>
                            <button
                              onClick={() => updateRecord(goal.id, { status: 'HOLD', achieved: undefined })}
                              className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition text-sm font-semibold bg-white border-2 border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700"
                            >
                              <Minus size={16} /> 보류
                            </button>
                            <button
                              onClick={() => updateRecord(goal.id, { status: 'FAIL', achieved: false })}
                              className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition text-sm font-semibold bg-white border-2 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-500 hover:text-red-700"
                            >
                              <X size={16} /> 실패
                            </button>
                          </div>
                        ) : (
                          <NumericGoalInput
                            goal={goal}
                            record={record}
                            onSave={(value) => updateRecord(goal.id, { numericValue: value })}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Completed Records Section */}
          {(() => {
            const completedGoals = goals.filter(goal => {
              const record = records.find(r => r.goalId === goal.id);
              const status = getRecordStatus(record);
              if (goal.type === 'BOOLEAN') {
                return !!status;
              } else {
                return record && record.numericValue !== undefined && record.numericValue !== null;
              }
            });

            if (completedGoals.length === 0) return null;

            return (
              <div className="mt-8">
                <button
                  onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
                  className="w-full flex items-center justify-between text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 group hover:text-gray-500 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    기록 완료 ({completedGoals.length})
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${!isCompletedCollapsed ? 'rotate-90' : ''}`} />
                </button>

                {!isCompletedCollapsed && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {completedGoals.sort((a, b) => {
                      const catA = categories.find(c => c.id === a.categoryId);
                      const catB = categories.find(c => c.id === b.categoryId);
                      const catOrderA = catA?.orderIndex ?? 999;
                      const catOrderB = catB?.orderIndex ?? 999;
                      if (catOrderA !== catOrderB) return catOrderA - catOrderB;
                      return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
                    }).map(goal => {
                      const record = records.find(r => r.goalId === goal.id);
                      const status = getRecordStatus(record);
                      const cat = categories.find(c => c.id === goal.categoryId);

                      return (
                        <div key={goal.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-75 hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-3 items-center flex-1 min-w-0">
                              <div className="text-2xl flex-shrink-0 grayscale">{goal.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-700 text-sm">{goal.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {goal.type === 'BOOLEAN' ? (
                                    <span className={`font-medium ${status === 'SUCCESS' ? 'text-green-600' : status === 'FAIL' ? 'text-red-600' : 'text-amber-600'}`}>
                                      {status === 'SUCCESS' ? '달성' : status === 'FAIL' ? '실패' : '보류'}
                                    </span>
                                  ) : (
                                    <span className="font-medium text-indigo-600">
                                      {record?.numericValue?.toLocaleString()} {goal.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (goal.type === 'BOOLEAN') {
                                  updateRecord(goal.id, { status: undefined, achieved: undefined });
                                } else {
                                  updateRecord(goal.id, { numericValue: undefined });
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 p-2"
                              title="다시 입력"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
