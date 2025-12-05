import React from 'react';
import { LogIn, X } from 'lucide-react';

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition z-10"
                    aria-label="닫기"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={32} className="text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        로그인이 필요합니다
                    </h3>

                    <p className="text-gray-600 mb-6">
                        데모 모드에서는 데이터를 수정할 수 없습니다.<br />
                        회원가입하고 나만의 목표를 관리해보세요!
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm"
                        >
                            취소
                        </button>
                        <button
                            onClick={onLogin}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/30 text-sm"
                        >
                            로그인/회원가입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
