// src/components/Admin/SummaryCards.tsx
import React from 'react';
import {
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserGroupIcon,
    GiftIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { GuestStatistics } from '../../types/guest.types';

interface SummaryCardsProps {
    statistics: GuestStatistics | null;
    loading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ statistics, loading }) => {
    const cards = [
        {
            title: 'Total de Convidados',
            value: statistics?.total || 0,
            icon: UsersIcon,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            suffix: ''
        },
        {
            title: 'Confirmados',
            value: statistics?.confirmados || 0,
            icon: CheckCircleIcon,
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            suffix: ''
        },
        {
            title: 'Não Confirmados',
            value: (statistics?.total || 0) - (statistics?.confirmados || 0),
            icon: XCircleIcon,
            bgColor: 'bg-red-100',
            textColor: 'text-red-600',
            suffix: ''
        },
        {
            title: 'Total de Pessoas',
            value: statistics?.totalPessoas || 0,
            icon: UserGroupIcon,
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            suffix: ''
        },
        {
            title: 'Presentes',
            value: statistics?.totalPresentes || 0,
            icon: GiftIcon,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600',
            suffix: ''
        },
        {
            title: 'Valor em Presentes',
            value: statistics?.valorTotalPresentes || 0,
            icon: CurrencyDollarIcon,
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-600',
            prefix: 'R$ ',
            suffix: ''
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`h-5 w-5 ${card.textColor}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 text-right">
                            {card.title}
                        </span>
                    </div>

                    {loading ? (
                        <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <div className="text-2xl font-bold text-gray-900">
                            {card.prefix || ''}{card.value}{card.suffix}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;