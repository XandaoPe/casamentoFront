// src/pages/InvitePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Guest } from '../types/guest.types';
import { PresenteCota, CardapioItem } from '../types/invite.types';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import HeroSection from '../components/Invite/HeroSection';
import CountdownSection from '../components/Invite/CountdownSection';
import LoveStorySection from '../components/Invite/LoveStorySection';
import PhotoGallery from '../components/Invite/PhotoGallery';
import LocationMap from '../components/Invite/LocationMap';
import MenuSection from '../components/Invite/MenuSection';
import GiftListSection from '../components/Invite/GiftListSection';
import ConfirmationForm from '../components/Invite/ConfirmationForm';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const InvitePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);
    const [presentes, setPresentes] = useState<PresenteCota[]>([]);
    const [cardapio, setCardapio] = useState<CardapioItem[]>([]);

    const EVENT_DATE = "2026-11-21T19:00:00";

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => {
                setShowWakeUpMessage(true);
            }, 2500);
        } else {
            setShowWakeUpMessage(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const loadInvite = useCallback(async () => {
        if (!token) return;
        try {
            const response = await api.get(`/guests/invite/${token}`);
            setGuest(response.data);
        } catch (error) {
            toast.error('Convite não encontrado');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const loadGifts = useCallback(async () => {
        try {
            const response = await api.get('/gifts');
            setPresentes(response.data);
        } catch (error) {
            console.error('Erro ao carregar presentes:', error);
        }
    }, []);

    const loadMenu = useCallback(async () => {
        try {
            const response = await api.get('/menu');
            setCardapio(response.data);
        } catch (error) {
            console.error('Erro ao carregar cardápio:', error);
        }
    }, []);

    useEffect(() => {
        loadInvite();
        loadGifts();
        loadMenu();
    }, [loadInvite, loadGifts, loadMenu]);

    const handleConfirmPresence = async (data: any) => {
        if (!token) {
            toast.error('Token inválido');
            return;
        }

        try {
            await api.post(`/guests/confirm/${token}`, data);
            toast.success('Presença confirmada com sucesso! 🎉');
            await loadInvite();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao confirmar');
        }
    };

    const handleBuyGift = async (giftId: string, quantidade: number) => {
        // Correção para evitar o 'null' enviado no POST
        const qtdFinal = Number(quantidade) || 1;

        if (!giftId) {
            toast.error('ID do presente inválido');
            return;
        }

        try {
            // Rota alterada para 'buy' conforme ajuste no Controller
            const response = await api.post('/gifts/buy', {
                giftId: giftId,
                quantidade: qtdFinal
            });

            // Atualiza o estado local do guest
            setGuest(prev => prev ? {
                ...prev,
                presenteSelecionado: {
                    presenteId: giftId,
                    nome: response.data.nome,
                    // Cálculo seguro para evitar NaN
                    valor: (response.data.valorTotal / (response.data.totalCotas || 1)) * qtdFinal,
                    quantidade: qtdFinal
                }
            } : null);

            toast.success('Ótima escolha! Obrigado pelo presente! 🎁');
            loadGifts(); // Recarrega cotas
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao selecionar presente');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 px-4 text-center">
                <LoadingSpinner />
                {showWakeUpMessage && (
                    <div className="mt-8 max-w-sm animate-fade-in">
                        <div className="flex items-center justify-center text-rose-600 mb-2">
                            <InformationCircleIcon className="h-6 w-6 mr-2" />
                            <span className="font-bold text-sm uppercase tracking-wider">Aviso</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            O servidor está acordando para conectar você ao nosso grande dia!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (!guest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Convite não encontrado</p>
            </div>
        );
    }

    // Configurações de seções
    const photos = [
        { url: '/images/noivado.png', caption: 'Nosso noivado' },
        { url: '/images/viagem.png', caption: 'Viagem dos sonhos' },
        { url: '/images/momentos.png', caption: 'Momento especial' },
        { url: '/images/familia.jpg', caption: 'Família' },
        { url: '/images/amigos.jpg', caption: 'Amigos' },
        { url: '/images/pedido.png', caption: 'O pedido' },
    ];

    const ceremony = {
        name: 'Igreja do Evangelho Quadrangular',
        address: 'Rua Minas Gerais, 14-50 - Vila Cruzeiro do Sul, Presidente Epitácio-SP',
        mapUrl: 'https://maps.google.com',
        time: '19:00'
    };

    const party = {
        name: 'Espaço Planet/Planet Kids',
        address: 'Av. Presidente Vargas, 27-07 - Vila Centenario, Presidente Epitácio-SP',
        mapUrl: 'https://maps.google.com',
        time: '20:30'
    };

    return (
        <div className="min-h-screen bg-white">
            <HeroSection nomeConvidado={guest.nome} dataEvento={EVENT_DATE} />
            <CountdownSection targetDate={EVENT_DATE} title="A contagem regressiva começou..." />
            <LoveStorySection />
            <PhotoGallery photos={photos} />
            <LocationMap ceremony={ceremony} party={party} />

            <MenuSection items={cardapio} isSelectable={false} onSelect={() => { }} />

            <GiftListSection
                presentes={presentes}
                // Ajuste aqui: usando explicitamente o _id do MongoDB
                onComprarCota={(gift, qtd) => handleBuyGift(gift._id, qtd)}
            />

            <section className="py-16 bg-rose-50">
                <div className="container-custom max-w-2xl">
                    <h2 className="font-script text-3xl md:text-4xl text-center mb-8">
                        Confirme sua Presença
                    </h2>

                    {guest.confirmado ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-green-700 mb-2">Presença Confirmada!</h3>
                            <p className="text-gray-600">Te esperamos lá! 🎉</p>
                        </div>
                    ) : (
                        <ConfirmationForm onSubmit={handleConfirmPresence} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default InvitePage;