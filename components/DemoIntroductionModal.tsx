import React from 'react';
import { Calendar, CheckCircle2, X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSignUp: () => void;
}

export const DemoIntroductionModal: React.FC<Props> = ({ onClose, onSignUp }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6 sm:p-8 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Calendar size={28} className="text-indigo-600" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                        2026년 계획을 미리 세워보세요
                    </h2>

                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                        OKR 플래너로 목표와 습관을 체계적으로 관리하고,<br />
                        더 나은 나를 위한 여정을 시작해보세요.
                    </p>

                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left bg-gray-50 p-4 sm:p-5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">목표 설정 및 습관 관리</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">월간 회고 및 성과 분석</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">드래그 앤 드롭으로 쉬운 관리</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onSignUp}
                            className="w-full bg-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-[0.98]"
                        >
                            시작하기
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 text-gray-600 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition"
                        >
                            먼저 둘러보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
