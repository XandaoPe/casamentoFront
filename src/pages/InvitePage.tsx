// src/pages/InvitePage.tsx (versão corrigida)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import api from '../services/api';
import { Guest, ConfirmPresenceDto } from '../types/guest.types';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Countdown from '../components/Common/Countdown';

interface Params {
    token: string;
    [key: string]: string | undefined;
}

const InvitePage: React.FC = () => {
    const { token } = useParams<Params>();
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [confirming, setConfirming] = useState<boolean>(false);
    const [confirmData, setConfirmData] = useState<ConfirmPresenceDto>({
        confirmado: true,
        numAcompanhantes: 0,
        mensagem: ''
    });
    const [activeTab, setActiveTab] = useState<'info' | 'confirm' | 'gallery' | 'local'>('info');

    const loadInvite = async (): Promise<void> => {
        if (!token) return;

        try {
            const response = await api.get<Guest>(`/guests/invite/${token}`);
            setGuest(response.data);
            setConfirmData((prev: ConfirmPresenceDto) => ({
                ...prev,
                numAcompanhantes: 0
            }));
        } catch (error) {
            toast.error('Convite não encontrado ou inválido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvite();
    }, [token]);

    const handleConfirm = async (): Promise<void> => {
        if (!token) return;

        setConfirming(true);
        try {
            await api.post(`/guests/confirm/${token}`, confirmData);
            toast.success('Presença confirmada com sucesso! 🎉');
            await loadInvite();
            setActiveTab('info');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao confirmar presença');
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!guest) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <XCircleIcon className="h-20 w-20 text-red-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Ops! Convite não encontrado</h1>
                        <p className="text-gray-600 mb-6">
                            O link que você acessou é inválido ou expirou.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="btn-primary w-full"
                        >
                            Voltar para o início
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
            {/* Hero Section */}
            <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
                <img
                    src="/images/hero-bg.jpg"
                    alt="Casamento"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/1920x1080?text=Casamento';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 text-center text-white pb-8 sm:pb-12 px-4">
                    <HeartIconSolid className="h-8 sm:h-10 w-8 sm:w-10 text-gold mx-auto mb-2 sm:mb-4 animate-bounce" />
                    <h1 className="font-script text-4xl sm:text-5xl lg:text-6xl mb-2 drop-shadow-lg">
                        {guest.nome}
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl opacity-90 drop-shadow-lg">
                        Você está convidado para nosso casamento!
                    </p>
                </div>
            </div>

            {/* Menu de Abas */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
                <div className="container-custom">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        {(['info', 'confirm', 'gallery', 'local'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${activeTab === tab
                                        ? 'text-gold border-b-2 border-gold'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab === 'info' && 'Informações'}
                                {tab === 'confirm' && (guest.confirmado ? 'Presença Confirmada' : 'Confirmar Presença')}
                                {tab === 'gallery' && 'Fotos'}
                                {tab === 'local' && 'Local'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="container-custom py-6 sm:py-8 lg:py-12">
                {/* Aba de Informações */}
                {activeTab === 'info' && (
                    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
                                Faltam apenas
                            </h2>
                            <Countdown targetDate="2024-12-15T17:00:00" />
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Detalhes do Evento</h2>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-rose-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gold flex-shrink-0" />
                                            <span className="font-medium">Data:</span>
                                        </div>
                                        <span className="text-gray-700 sm:ml-0">15 de Dezembro de 2024</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-rose-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gold flex-shrink-0" />
                                            <span className="font-medium">Horário:</span>
                                        </div>
                                        <span className="text-gray-700 sm:ml-0">17:00</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-rose-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gold flex-shrink-0" />
                                            <span className="font-medium">Local:</span>
                                        </div>
                                        <span className="text-gray-700 sm:ml-0">Igreja Matriz - Rua Principal, 123</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                            <HeartIconSolid className="h-8 w-8 sm:h-10 sm:w-10 text-gold mx-auto mb-4" />
                            <p className="text-gray-600 italic text-sm sm:text-base">
                                "A alegria de compartilhar este momento com você é imensa.
                                Sua presença será nosso melhor presente."
                            </p>
                            <p className="mt-4 font-script text-xl sm:text-2xl text-gold">
                                Noivos
                            </p>
                        </div>
                    </div>
                )}

                {/* Aba de Confirmação */}
                {activeTab === 'confirm' && (
                    <div className="max-w-2xl mx-auto animate-fade-in">
                        {guest.confirmado ? (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                                <div className="mb-6">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-2">
                                        Presença Confirmada!
                                    </h2>
                                    <p className="text-gray-600">
                                        Você confirmou para {guest.numAcompanhantes} acompanhante(s)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
                                    Confirme sua Presença
                                </h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <button
                                            onClick={() => setConfirmData({ ...confirmData, confirmado: true })}
                                            className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${confirmData.confirmado
                                                    ? 'border-gold bg-gold/5'
                                                    : 'border-gray-200 hover:border-gold/50'
                                                }`}
                                        >
                                            <CheckCircleIcon className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 ${confirmData.confirmado ? 'text-gold' : 'text-gray-400'
                                                }`} />
                                            <span className={`block text-sm sm:text-base font-medium ${confirmData.confirmado ? 'text-gold' : 'text-gray-600'
                                                }`}>
                                                Vou Comparecer
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setConfirmData({ ...confirmData, confirmado: false })}
                                            className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${!confirmData.confirmado
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-red-500/50'
                                                }`}
                                        >
                                            <XCircleIcon className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 ${!confirmData.confirmado ? 'text-red-500' : 'text-gray-400'
                                                }`} />
                                            <span className={`block text-sm sm:text-base font-medium ${!confirmData.confirmado ? 'text-red-500' : 'text-gray-600'
                                                }`}>
                                                Não Poderei Ir
                                            </span>
                                        </button>
                                    </div>

                                    {confirmData.confirmado && (
                                        <div className="space-y-3 animate-fade-in">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Número de acompanhantes (máx: {guest.maxAcompanhantes})
                                            </label>
                                            <div className="flex items-center justify-center space-x-4">
                                                <button
                                                    onClick={() => setConfirmData((prev: ConfirmPresenceDto) => ({
                                                        ...prev,
                                                        numAcompanhantes: Math.max(0, prev.numAcompanhantes - 1)
                                                    }))}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                >
                                                    <span className="text-xl sm:text-2xl font-bold">-</span>
                                                </button>
                                                <span className="text-2xl sm:text-3xl font-semibold w-12 sm:w-16 text-center">
                                                    {confirmData.numAcompanhantes}
                                                </span>
                                                <button
                                                    onClick={() => setConfirmData((prev: ConfirmPresenceDto) => ({
                                                        ...prev,
                                                        numAcompanhantes: Math.min(guest.maxAcompanhantes, prev.numAcompanhantes + 1)
                                                    }))}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                >
                                                    <span className="text-xl sm:text-2xl font-bold">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Deixe uma mensagem (opcional)
                                        </label>
                                        <textarea
                                            value={confirmData.mensagem}
                                            onChange={(e) => setConfirmData({ ...confirmData, mensagem: e.target.value })}
                                            placeholder="Escreva uma mensagem para os noivos..."
                                            rows={3}
                                            className="input-field resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={confirming}
                                        className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {confirming ? 'Confirmando...' : 'Confirmar Presença'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Aba de Galeria */}
                {activeTab === 'gallery' && (
                    <div className="animate-fade-in">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                            <div className="text-gold text-6xl mb-4">📸</div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Galeria de Fotos</h2>
                            <p className="text-gray-600">
                                Em breve você poderá ver as fotos do casamento aqui!
                            </p>
                        </div>
                    </div>
                )}

                {/* Aba de Local */}
                {activeTab === 'local' && (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Local do Evento</h2>
                                <p className="text-gray-600 mb-6">
                                    A cerimônia será realizada na Igreja Matriz, seguida de recepção no Espaço Villa.
                                </p>

                                <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                                    <MapPinIcon className="h-12 w-12 text-gray-400" />
                                    <span className="ml-2 text-gray-500">Mapa será carregado aqui</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Igreja Matriz</h3>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                Rua Principal, 123 - Centro<br />
                                                Cidade - Estado
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold">Espaço Villa (Recepção)</h3>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                Avenida Secundária, 456 - Jardins<br />
                                                Cidade - Estado
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitePage;