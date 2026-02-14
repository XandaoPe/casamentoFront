// src/components/Common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    fullScreen = false,
    color = 'gold'
}) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    const colorClasses = {
        gold: 'border-t-gold',
        white: 'border-t-white',
        primary: 'border-t-primary-600'
    };

    const spinner = (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 ${colorClasses[color as keyof typeof colorClasses] || 'border-t-gold'
                    }`}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;