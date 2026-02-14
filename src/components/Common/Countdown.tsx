// src/components/Common/Countdown.tsx
import React, { useState, useEffect } from 'react';

interface CountdownProps {
    targetDate: string;
    onComplete?: () => void;
}

interface TimeLeft {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft | null => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutos: Math.floor((difference / 1000 / 60) % 60),
                    segundos: Math.floor((difference / 1000) % 60)
                };
            }

            return null;
        };

        const updateCountdown = () => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (!newTimeLeft && onComplete) {
                onComplete();
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) {
        return (
            <div className="text-center text-gold font-semibold">
                O grande dia chegou! 🎉
            </div>
        );
    }

    const timeUnits = [
        { label: 'dias', value: timeLeft.dias },
        { label: 'horas', value: timeLeft.horas },
        { label: 'minutos', value: timeLeft.minutos },
        { label: 'segundos', value: timeLeft.segundos }
    ];

    return (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {timeUnits.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold">
                        {value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 capitalize">
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;