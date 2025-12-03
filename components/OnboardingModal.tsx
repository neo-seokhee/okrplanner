import React from 'react';
import { X, Sparkles, Target, TrendingUp, Calendar } from 'lucide-react';

interface OnboardingModalProps {
    onClose: () => void;
    onSignUp: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, onSignUp }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
                        aria-label="닫기"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={24} className="animate-pulse" />
                            <h2 className="text-2xl font-bold">OKR 플래너에 오신 것을 환영합니다!</h2>
                        </div>
                        <p className="text-white/90 text-sm">
                            목표를 설정하고 달성하는 가장 쉬운 방법
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Target size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">목표 설정 & 관리</h3>
                                <p className="text-sm text-gray-600">카테고리별로 목표를 체계적으로 관리하세요</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">진행 상황 추적</h3>
                                <p className="text-sm text-gray-600">매월 목표 달성률을 한눈에 확인하세요</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Calendar size={20} className="text-pink-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">회고 노트</h3>
                                <p className="text-sm text-gray-600">매월 회고를 작성하며 성장하세요</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <p className="text-sm text-gray-700 text-center">
                            <span className="font-semibold text-indigo-600">지금 보시는 화면은 데모입니다.</span><br />
                            회원가입하고 나만의 목표를 관리해보세요! 🚀
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
                        >
                            둘러보기
                        </button>
                        <button
                            onClick={onSignUp}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/30"
                        >
                            시작하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
