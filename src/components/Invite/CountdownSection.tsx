// src/components/Invite/CountdownSection.tsx
import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface CountdownSectionProps {
    targetDate: string;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutos: Math.floor((difference / 1000 / 60) % 60),
                    segundos: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeUnits = [
        { label: 'dias', value: timeLeft.dias },
        { label: 'horas', value: timeLeft.horas },
        { label: 'minutos', value: timeLeft.minutos },
        { label: 'segundos', value: timeLeft.segundos }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-rose-50 to-white">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <ClockIcon className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-2">
                        Faltam apenas
                    </h2>
                    <p className="text-gray-600">para o grande dia!</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {timeUnits.map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center mb-2">
                                <span className="text-3xl md:text-4xl font-bold text-gold">
                                    {value.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <span className="text-sm md:text-base text-gray-600 capitalize">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CountdownSection;