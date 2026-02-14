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
    ArrowRightOnRectangleIcon
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
        {
            title: 'Total de Convidados',
            value: statistics?.total || 0,
            icon: UsersIcon,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            title: 'Confirmados',
            value: statistics?.confirmados || 0,
            icon: CheckCircleIcon,
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Não Confirmados',
            value: (statistics?.total || 0) - (statistics?.confirmados || 0),
            icon: XCircleIcon,
            bgColor: 'bg-red-100',
            textColor: 'text-red-600'
        },
        {
            title: 'Total de Pessoas',
            value: statistics?.totalPessoas || 0,
            icon: UserGroupIcon,
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Bem-vindo, {user?.username}!
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/guests')}
                                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                            >
                                Gerenciar Convidados
                            </button>

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Sair"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`h-6 w-6 ${card.textColor}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-400">
                                    {card.title}
                                </span>
                            </div>

                            {loading ? (
                                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-3xl font-bold text-gray-900">
                                    {card.value}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Taxa de Confirmação */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Taxa de Confirmação
                    </h2>

                    {loading ? (
                        <div className="h-4 bg-gray-200 animate-pulse rounded-full"></div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{statistics?.taxaConfirmacao}% confirmado</span>
                                <span>{statistics?.confirmados} de {statistics?.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-gold h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${statistics?.taxaConfirmacao || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirmações por Grupo */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Confirmações por Grupo
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {statistics?.porGrupo.map((grupo) => (
                                <div key={grupo._id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">
                                            {grupo._id}
                                        </span>
                                        <span className="text-gray-600">
                                            {grupo.confirmados} de {grupo.total}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gold h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${grupo.total > 0
                                                    ? (grupo.confirmados / grupo.total) * 100
                                                    : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}

                            {(!statistics?.porGrupo || statistics.porGrupo.length === 0) && (
                                <p className="text-center text-gray-500 py-4">
                                    Nenhum grupo cadastrado
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;