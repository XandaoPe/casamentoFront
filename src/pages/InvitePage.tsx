// src/pages/InvitePage.tsx
import React, { useState, useEffect, useCallback } from 'react'; // Adicionar useCallback
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Guest } from '../types/guest.types';
import { PresenteCota, CardapioItem } from '../types/invite.types';
import LoadingSpinner from '../components/Common/LoadingSpinner';

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
    const [presentes, setPresentes] = useState<PresenteCota[]>([]);
    const [cardapio, setCardapio] = useState<CardapioItem[]>([]);

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
        console.log('Token:', token); // Verificar se o token existe
        console.log('Dados enviados:', data); // Verificar os dados

        if (!token) {
            toast.error('Token inválido');
            return;
        }

        try {
            const response = await api.post(`/guests/confirm/${token}`, data);
            console.log('Resposta:', response.data);
            toast.success('Presença confirmada com sucesso! 🎉');
            await loadInvite();
        } catch (error: any) {
            console.error('Erro completo:', error);
            console.error('Resposta do erro:', error.response?.data);
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
        return <LoadingSpinner fullScreen />;
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