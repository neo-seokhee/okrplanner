import React, { useState, useRef } from 'react';
import { User, LogIn, LogOut, Database, UserCircle, UserPlus, Lock, Mail, AlertCircle, Download, Upload, MessageSquare, Send, Camera, X } from 'lucide-react';
import { User as UserType } from '../types';
import * as db from '../services/storageService';
import { supabase } from '../services/supabase';
import { submitFeedback, uploadProfilePhoto } from '../services/integrations';

interface Props {
  currentUser: UserType | null;
  onLogin: (user: UserType) => void;
  onLogout: () => void;
}

export const Settings: React.FC<Props> = ({ currentUser, onLogin, onLogout }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Profile photo state
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(
    currentUser?.user_metadata?.avatar_url || null
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'REGISTER') {
        if (!formData.username || !formData.email || !formData.password) {
          throw new Error('모든 정보를 입력해주세요.');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }
        const user = await db.register(formData.email, formData.password, formData.username);
        onLogin(user);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }
        const user = await db.login(formData.email, formData.password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await db.logout();
    onLogout();
    setIsLoading(false);
  };

  // Kakao Login
  const handleKakaoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: window.location.origin,
          scopes: 'profile_nickname profile_image',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // Feedback submission
  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;

    setFeedbackSubmitting(true);
    const success = await submitFeedback(
      feedbackEmail || currentUser?.email || 'anonymous',
      feedbackText
    );
    setFeedbackSubmitting(false);

    if (success) {
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackText('');
        setFeedbackEmail('');
        setFeedbackSuccess(false);
      }, 2000);
    } else {
      alert('피드백 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // Profile photo upload
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploadingPhoto(true);
    const photoUrl = await uploadProfilePhoto(currentUser.id, file);

    if (photoUrl) {
      // Update user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: photoUrl }
      });
      setProfilePhotoUrl(photoUrl);
    } else {
      alert('프로필 사진 업로드에 실패했습니다.');
    }
    setUploadingPhoto(false);
    e.target.value = '';
  };

  // --- Backup & Restore ---

  const handleBackup = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await db.exportAllData(currentUser.id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OKR_Planner_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('데이터 백업 파일이 다운로드되었습니다.');
    } catch (e) {
      console.error(e);
      alert('백업 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setIsLoading(true);
        const success = await db.importAllData(content, currentUser.id);
        setIsLoading(false);
        if (success) {
          alert('데이터 복구가 완료되었습니다. 페이지를 새로고침합니다.');
          window.location.reload();
        } else {
          alert('데이터 복구에 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
        }
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${mode === 'LOGIN' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              로그인
            </button>
            <button
              onClick={() => { setMode('REGISTER'); setError(null); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${mode === 'REGISTER' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              회원가입
            </button>
          </div>

          <div className="p-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {mode === 'LOGIN' ? <User size={32} /> : <UserPlus size={32} />}
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {mode === 'LOGIN' ? '다시 오셨군요!' : 'OKR 플래너 시작하기'}
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
              {mode === 'LOGIN' ? '목표 달성을 위해 로그인이 필요합니다.' : '계정을 만들고 목표 관리를 시작해보세요.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">이름 (닉네임)</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      placeholder="길동이"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {mode === 'REGISTER' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:shadow-none mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'LOGIN' ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {mode === 'LOGIN' ? '로그인' : '회원가입 완료'}
                  </>
                )}
              </button>

              {/* Kakao Login Button */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">또는</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleKakaoLogin}
                disabled={isLoading}
                className="w-full bg-[#FEE500] text-[#000000] py-3 rounded-xl font-semibold hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C5.925 3 1 6.925 1 11.775C1 14.85 3.025 17.55 6.05 19.05L5.05 22.725C4.975 23.025 5.35 23.25 5.6 23.075L10.15 19.95C10.75 20.025 11.375 20.1 12 20.1C18.075 20.1 23 16.175 23 11.325C23 6.475 18.075 3 12 3Z" />
                </svg>
                카카오로 시작하기
              </button>

              {/* Restore button for lost users */}
              <div className="pt-4 border-t border-gray-100 mt-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleRestoreClick}
                  className="text-gray-400 text-xs hover:text-indigo-600 underline flex items-center justify-center gap-1 mx-auto"
                >
                  <Upload size={12} /> 혹시 데이터가 날라갔나요? (백업 파일 복구)
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              이 서비스는 Supabase DB를 사용합니다.
              <br />데이터는 안전하게 클라우드에 저장됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Profile Section with Photo Upload */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="relative">
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {currentUser.username[0].toUpperCase()}
            </div>
          )}
          <button
            onClick={() => profilePhotoInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition shadow-lg"
          >
            {uploadingPhoto ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera size={12} />
            )}
          </button>
          <input
            ref={profilePhotoInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{currentUser.username}님, 안녕하세요!</h2>
          <p className="text-gray-500 text-sm">{currentUser.email || '이메일 정보 없음'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">데이터 관리</h3>

        <button
          onClick={handleBackup}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Download size={20} />
            <span>데이터 백업 (내보내기)</span>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium group-hover:bg-indigo-100 transition">JSON 다운로드</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={handleRestoreClick}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Upload size={20} />
            <span>데이터 복구 (불러오기)</span>
          </div>
          <span className="text-xs text-gray-400 group-hover:text-gray-600 transition">파일 선택</span>
        </button>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 pt-4">피드백</h3>
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <MessageSquare size={20} />
            <span>의견 보내기</span>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium group-hover:bg-indigo-100 transition">피드백</span>
        </button>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 pt-4">계정</h3>

        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center gap-2 text-red-600 font-medium active:scale-[0.99] transition hover:bg-red-100"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400">OKR 플래너 v1.2.0</p>
        <p className="text-xs text-gray-300 mt-1">Supabase Edition</p>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">의견 보내기</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">감사합니다!</p>
                <p className="text-gray-500 mt-1">소중한 의견을 보내주셨습니다.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      이메일 (선택)
                    </label>
                    <input
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder={currentUser.email || 'your@email.com'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      피드백
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="이 앱에 대한 의견, 개선 사항, 버그 신고 등을 자유롭게 적어주세요."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackSubmitting || !feedbackText.trim()}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {feedbackSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      전송하기
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};