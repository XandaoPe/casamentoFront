// src/pages/AdminDashboardPage.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGuests } from '../hooks/useGuests';
import { useNavigate } from 'react-router-dom';
import {
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserGroupIcon,
    ArrowRightOnRectangleIcon,
    GiftIcon
} from '@heroicons/react/24/outline';

const AdminDashboardPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const { statistics, loading, loadStatistics } = useGuests();
    const navigate = useNavigate();

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    const handleLogout = () => {
        signOut();
        navigate('/admin/login');
    };

    const statsCards = [
        { title: 'Total de Convidados', value: statistics?.total || 0, icon: UsersIcon, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
        { title: 'Confirmados', value: statistics?.confirmados || 0, icon: CheckCircleIcon, bgColor: 'bg-green-100', textColor: 'text-green-600' },
        { title: 'Não Confirmados', value: (statistics?.total || 0) - (statistics?.confirmados || 0), icon: XCircleIcon, bgColor: 'bg-red-100', textColor: 'text-red-600' },
        { title: 'Total de Pessoas', value: statistics?.totalPessoas || 0, icon: UserGroupIcon, bgColor: 'bg-purple-100', textColor: 'text-purple-600' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600">Bem-vindo, {user?.username}!</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/admin/gifts')}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium shadow-sm"
                        >
                            <GiftIcon className="h-5 w-5" />
                            Gerenciar Presentes
                        </button>

                        <button
                            onClick={() => navigate('/admin/guests')}
                            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium shadow-sm"
                        >
                            Gerenciar Convidados
                        </button>

                        <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}><card.icon className={`h-6 w-6 ${card.textColor}`} /></div>
                                <span className="text-sm font-medium text-gray-400">{card.title}</span>
                            </div>
                            {loading ? <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div> : <div className="text-3xl font-bold text-gray-900">{card.value}</div>}
                        </div>
                    ))}
                </div>
                {/* ... Restante das estatísticas de confirmação e grupo ... */}
            </main>
        </div>
    );
};

export default AdminDashboardPage;