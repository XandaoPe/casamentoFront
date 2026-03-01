import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Guest } from '../types/guest.types';
import { PresenteCota, CardapioItem, MinhaReserva } from '../types/invite.types';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { CheckCircleIcon, InformationCircleIcon, TrashIcon, GiftIcon } from '@heroicons/react/24/outline';

import HeroSection from '../components/Invite/HeroSection';
import CountdownSection from '../components/Invite/CountdownSection';
import LoveStorySection from '../components/Invite/LoveStorySection';
import PhotoGallery from '../components/Invite/PhotoGallery';
import LocationMap from '../components/Invite/LocationMap';
import MenuSection from '../components/Invite/MenuSection';
import GiftListSection from '../components/Invite/GiftListSection';
import ConfirmationForm from '../components/Invite/ConfirmationForm';

const InvitePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);
    const [presentes, setPresentes] = useState<PresenteCota[]>([]);
    const [cardapio, setCardapio] = useState<CardapioItem[]>([]);

    // NOVO ESTADO: Armazena a lista de presentes escolhidos pelo convidado
    const [minhasEscolhas, setMinhasEscolhas] = useState<MinhaReserva[]>([]);

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

    // FUNÇÃO PARA BUSCAR OS PRESENTES ESCOLHIDOS
    const loadMyReservations = useCallback(async (guestId: string) => {
        try {
            const response = await api.get(`/gifts/reservations/by-guest/${guestId}`);
            setMinhasEscolhas(response.data);
        } catch (error) {
            console.error("Erro ao carregar reservas:", error);
        }
    }, []);

    const loadInvite = useCallback(async () => {
        if (!token) return;
        try {
            const response = await api.get(`/guests/invite/${token}`);
            setGuest(response.data);
            // Busca pelo ID único do MongoDB
            loadMyReservations(response.data._id);
        } catch (error) {
            toast.error('Convite não encontrado');
        } finally {
            setLoading(false);
        }
    }, [token, loadMyReservations]);

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

    const handleBuyGift = async (giftId: string, quantidade: number, nome: string, mensagem: string) => {
        try {
            await api.post('/gifts/buy', {
                giftId,
                guestId: guest?._id, // Enviando ID absoluto
                quantidade,
                nome: guest?.nome, // Nome oficial do banco
                mensagem
            });
            toast.success('Obrigado pelo presente! 🎁');
            loadGifts();
            if (guest) loadMyReservations(guest._id);
        } catch (error: any) {
            toast.error('Erro ao processar presente');
        }
    };

    // FUNÇÃO PARA EXCLUIR UM PRESENTE ESCOLHIDO
    const handleDeleteChoice = async (reservationId: string) => {
        if (!window.confirm('Deseja remover este item da sua lista de presentes?')) return;
        try {
            await api.delete(`/gifts/reservation/guest/${reservationId}`);
            toast.success('Item removido com sucesso');
            loadGifts(); // Atualiza o estoque geral
            if (guest?._id) loadMyReservations(guest._id); // CORREÇÃO: Usar _id em vez de nome
        } catch (error) {
            toast.error('Erro ao remover item');
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
        mapUrl: 'https://maps.app.goo.gl/3sRArpq8J6bd4iED9',
        time: '19:00'
    };

    const party = {
        name: 'Espaço Planet/Planet Kids',
        address: 'Av. Presidente Vargas, 27-07 - Vila Centenario, Presidente Epitácio-SP',
        mapUrl: 'https://maps.app.goo.gl/1bTAcLs76SXuJig29',
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

            {/* NOVA SEÇÃO: LISTA DE PRESENTES ESCOLHIDOS PELO CONVIDADO */}
            {minhasEscolhas.length > 0 && (
                <section className="py-12 bg-rose-50/50 border-y border-rose-100">
                    <div className="container-custom max-w-2xl px-4">
                        <div className="text-center mb-8">
                            <GiftIcon className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                                Minhas Escolhas
                            </h2>
                            <p className="text-sm text-gray-500 italic">Itens que você selecionou:</p>
                        </div>

                        <div className="grid gap-4">
                            {minhasEscolhas.map((item) => (
                                <div key={item._id} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border">
                                            {item.giftId?.imagemUrl ? (
                                                <img src={item.giftId.imagemUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <GiftIcon className="w-6 h-6 m-4 text-rose-200" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">
                                                {item.giftId?.nome || 'Presente'}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {item.quantidadeCotas} {item.quantidadeCotas > 1 ? 'cotas' : 'cota'} • R$ {item.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteChoice(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Excluir escolha"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <GiftListSection
                presentes={presentes}
                onComprarCota={handleBuyGift}
                guestName={guest.nome}
            />

            <section className="py-16 bg-rose-50">
                <div className="container-custom max-w-2xl">
                    <h2 className="font-script text-3xl md:text-4xl text-center mb-8 text-rose-800">
                        Confirme sua Presença
                    </h2>

                    {guest.confirmado ? (
                        <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-2 border-green-50">
                            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-green-700 mb-2">Presença Confirmada!</h3>
                            <p className="text-gray-600">Ficamos muito felizes que você virá! 🎉</p>
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