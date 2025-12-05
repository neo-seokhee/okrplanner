import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, X } from 'lucide-react';
import { User } from '../types';

interface Props {
    user: User;
    isDemoMode: boolean;
}

export const DemoIntroductionModal: React.FC<Props> = ({ user, isDemoMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal if it's demo mode and we haven't shown it in this session yet
        // simple session storage check to avoid showing it on every reload if desired,
        // or just show it every time for demo purposes as requested.
        // The user request implies "Before login, during demo", so showing it once on mount is good.
        if (isDemoMode) {
            const hasShown = sessionStorage.getItem('demo_intro_shown');
            if (!hasShown) {
                setIsOpen(true);
                sessionStorage.setItem('demo_intro_shown', 'true');
            }
        }
    }, [isDemoMode]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in hover:scale-[1.02] zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={32} className="text-indigo-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        2026년 계획을 미리 세워보세요
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        OKR 플래너로 목표와 습관을 체계적으로 관리하고,<br />
                        더 나은 나를 위한 여정을 시작해보세요.
                    </p>

                    <div className="space-y-3 mb-8 text-left bg-gray-50 p-5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">목표 설정 및 습관 관리</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">월간 회고 및 성과 분석</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm">드래그 앤 드롭으로 쉬운 관리</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-[0.98]"
                    >
                        데모 체험하기
                    </button>
                </div>
            </div>
        </div>
    );
};
