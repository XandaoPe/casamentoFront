import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Guest } from '../types/guest.types';
import { PresenteCota, CardapioItem } from '../types/invite.types';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { InformationCircleIcon } from '@heroicons/react/24/outline'; // Adicionado ícone

// Componentes
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
    const [showWakeUpMessage, setShowWakeUpMessage] = useState(false); // Novo estado
    const [presentes, setPresentes] = useState<PresenteCota[]>([]);
    const [cardapio, setCardapio] = useState<CardapioItem[]>([]);

    // Efeito para o cronômetro do servidor (Cold Start)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => {
                setShowWakeUpMessage(true);
            }, 2500); // Se demorar mais de 2.5s, mostra a mensagem
        } else {
            setShowWakeUpMessage(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const loadInvite = useCallback(async () => {
        if (!token) return;

        // --- ADICIONE ESTA LINHA PARA TESTAR ---
        // await new Promise(resolve => setTimeout(resolve, 10000));
        // Isso vai travar a tela em "loading" por 10 segundos

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
            const response = await api.post(`/guests/confirm/${token}`, data);
            toast.success('Presença confirmada com sucesso! 🎉');
            await loadInvite();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao confirmar');
        }
    };

    const handleBuyGift = async (presente: PresenteCota, quantidade: number) => {
        try {
            await api.post('/gifts/buy', {
                presenteId: presente.id,
                quantidade,
                guestId: guest?._id
            });
            toast.success('Cota reservada com sucesso!');
            await loadGifts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao comprar cota');
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
                            Segura a ansiedade! 🥂 Estamos conectando você ao nosso grande dia. Como o servidor é gratuito, ele às vezes tira um cochilo, mas já está acordando (leva só 1 min)!
                        </p>
                        <div className="mt-4 flex justify-center space-x-1">
                            <div className="h-1.5 w-1.5 bg-rose-300 rounded-full animate-bounce"></div>
                            <div className="h-1.5 w-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
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
        mapUrl: 'https://maps.app.goo.gl/WDQRfGCdVLQaprVH6',
        time: '19:00'
    };

    const party = {
        name: 'Espaço Planet/Planet Kids',
        address: 'Av. Presidente Vargas, 27-07 - Vila Centenario, Presidente Epitácio-SP',
        mapUrl: 'https://maps.app.goo.gl/Q4AYNt2DvCo4t6pUA',
        time: '20:30'
    };

    return (
        <div className="min-h-screen bg-white">
            <HeroSection
                nomeConvidado={guest.nome}
                dataEvento="2024-12-15T17:00:00"
            />
            <CountdownSection targetDate="2024-12-15T17:00:00" />
            <LoveStorySection />
            <PhotoGallery photos={photos} />
            <LocationMap ceremony={ceremony} party={party} />
            <MenuSection
                items={cardapio}
                isSelectable={false}
                onSelect={(item) => console.log('Selecionado:', item)}
            />
            <GiftListSection
                presentes={presentes}
                onComprarCota={handleBuyGift}
            />
            <section className="py-16 bg-rose-50">
                <div className="container-custom max-w-2xl">
                    <h2 className="font-script text-3xl md:text-4xl text-center mb-8">
                        Confirme sua Presença
                    </h2>

                    {guest.confirmado ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-green-700 mb-2">
                                Presença Confirmada!
                            </h3>
                            <p className="text-gray-600">
                                Sua presença foi confirmada com sucesso!
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                Te esperamos lá! 🎉
                            </p>
                        </div>
                    ) : (
                        <ConfirmationForm
                            onSubmit={handleConfirmPresence}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default InvitePage;