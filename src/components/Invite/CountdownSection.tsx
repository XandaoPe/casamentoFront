// src/components/Invite/CountdownSection.tsx
import React, { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface CountdownSectionProps {
    targetDate: string; // Formato: "2026-12-31T19:00:00"
    title?: string;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({
    targetDate,
    title = "Contagem Regressiva"
}) => {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-6 min-w-[70px] sm:min-w-[100px] shadow-xl">
            <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gold font-bold mt-1">
                {label}
            </span>
        </div>
    );

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background com Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/60 backdrop-brightness-75" />
            </div>

            <div className="container-custom relative z-10 text-center">
                <h2 className="font-script text-4xl md:text-5xl text-white mb-8">
                    {title}
                </h2>

                <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
                    <TimeUnit value={timeLeft.days} label="Dias" />
                    <TimeUnit value={timeLeft.hours} label="Horas" />
                    <TimeUnit value={timeLeft.minutes} label="Min." />
                    <TimeUnit value={timeLeft.seconds} label="Seg." />
                </div>

                <p className="mt-8 text-white/80 font-medium tracking-widest uppercase text-sm px-4">
                    Para o nosso "Sim" para sempre
                </p>
            </div>
        </section>
    );
};

export default CountdownSection;