import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    GiftIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ArrowLeftIcon,
    XMarkIcon,
    PhotoIcon,
    UserGroupIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AddGiftModal from '../components/Admin/AddGiftModal';

const AdminGiftsPage: React.FC = () => {
    const navigate = useNavigate();
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState<any>(null);
    const [viewingGift, setViewingGift] = useState<any>(null);

    // Estados para controle de compradores
    const [showBuyersModal, setShowBuyersModal] = useState(false);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loadingReservations, setLoadingReservations] = useState(false);

    const loadGifts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gifts/admin');
            setGifts(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar presentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadGifts(); }, []);

    const handleEditClick = (gift: any) => {
        setSelectedGift(gift);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este presente?')) return;
        try {
            await api.delete(`/gifts/admin/${id}`);
            toast.success('Excluído com sucesso');
            loadGifts();
        } catch (error) {
            toast.error('Erro ao excluir');
        }
    };

    // FUNÇÃO PARA BUSCAR QUEM PRESENTEOU
    const handleShowBuyers = async (gift: any) => {
        try {
            setSelectedGift(gift);
            setShowBuyersModal(true);
            setLoadingReservations(true);

            // Endpoint sugerido: Ajuste conforme sua rota de backend
            const response = await api.get(`/gifts/${gift._id}/reservations`);
            setReservations(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar lista de convidados');
        } finally {
            setLoadingReservations(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <GiftIcon className="h-8 w-8 text-rose-600" />
                                Gerenciar Presentes
                            </h1>
                            <p className="text-gray-500 text-sm">Controle sua lista e veja quem te presenteou</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setSelectedGift(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Novo Presente
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-medium text-gray-400 animate-pulse">Carregando presentes...</div>
                ) : gifts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                        <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Nenhum presente cadastrado</h3>
                        <p className="text-gray-500 mb-6">Comece adicionando itens para seus convidados.</p>
                        <button onClick={() => { setSelectedGift(null); setIsModalOpen(true); }} className="text-rose-600 font-bold hover:underline">
                            Cadastrar meu primeiro presente
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gifts.map((gift: any) => (
                            <div key={gift._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                <div className="relative h-48 bg-gray-100">
                                    {gift.imagemUrl ? (
                                        <img src={gift.imagemUrl} alt={gift.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <PhotoIcon className="h-12 w-12" />
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setViewingGift(gift)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-blue-600"><EyeIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleEditClick(gift)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-amber-600"><PencilIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(gift._id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                    </div>

                                    <div className="absolute bottom-3 left-3">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${gift.ativo ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {gift.ativo ? 'Ativo' : 'Oculto'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{gift.nome}</h3>

                                    {/* Barra de Progresso Visual */}
                                    <div className="w-full bg-gray-100 h-2 rounded-full my-3 overflow-hidden">
                                        <div
                                            className="bg-rose-500 h-full transition-all duration-500"
                                            style={{ width: `${(gift.cotasVendidas / gift.totalCotas) * 100}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-rose-600 font-black text-sm">R$ {gift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                                                {gift.cotasVendidas} de {gift.totalCotas} cotas
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleShowBuyers(gift)}
                                            className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                                        >
                                            <UserGroupIcon className="h-4 w-4" />
                                            <span className="text-xs font-bold">Ver Nomes</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE QUEM PRESENTEOU (HISTÓRICO) */}
            {showBuyersModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Quem presenteou?</h3>
                                <p className="text-sm text-gray-500">{selectedGift?.nome}</p>
                            </div>
                            <button onClick={() => setShowBuyersModal(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-all">
                                <XMarkIcon className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {loadingReservations ? (
                                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>
                            ) : reservations.length === 0 ? (
                                <div className="text-center py-10">
                                    <UserGroupIcon className="h-12 w-12 text-gray-200 mx-auto mb-2" />
                                    <p className="text-gray-500">Ninguém presenteou este item ainda.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reservations.map((res: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-800">{res.nomeConvidado}</span>
                                                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-bold">
                                                    {res.quantidadeCotas} {res.quantidadeCotas > 1 ? 'cotas' : 'cota'}
                                                </span>
                                            </div>
                                            {res.mensagem && (
                                                <div className="flex gap-2 text-sm text-gray-600 italic bg-white p-3 rounded-lg border border-gray-50">
                                                    <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-gray-400 shrink-0" />
                                                    "{res.mensagem}"
                                                </div>
                                            )}
                                            <div className="mt-2 text-[10px] text-gray-400 text-right">
                                                {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50">
                            <button onClick={() => setShowBuyersModal(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE VISUALIZAÇÃO GERAL */}
            {viewingGift && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="relative h-64">
                            <img src={viewingGift.imagemUrl || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setViewingGift(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-all">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{viewingGift.nome}</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Valor Total</span>
                                    <span className="font-bold text-gray-900">R$ {viewingGift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Cotas Vendidas</span>
                                    <span className="font-bold text-rose-600">{viewingGift.cotasVendidas || 0} de {viewingGift.totalCotas}</span>
                                </div>
                            </div>
                            <button onClick={() => setViewingGift(null)} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold">Fechar Detalhes</button>
                        </div>
                    </div>
                </div>
            )}

            <AddGiftModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedGift(null); }}
                onSuccess={loadGifts}
                gift={selectedGift}
            />
        </div>
    );
};

export default AdminGiftsPage;