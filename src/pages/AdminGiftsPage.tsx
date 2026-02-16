// src/pages/AdminGiftsPage.tsx
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
    PhotoIcon // Adicionado ícone de foto
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
                            <p className="text-gray-500 text-sm">Controle sua lista de presentes e cotas</p>
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

                {/* Grid de Cards (Melhor que tabela para ver imagens) */}
                {loading ? (
                    <div className="text-center py-20 font-medium text-gray-400 animate-pulse">Carregando presentes...</div>
                ) : gifts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                        <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Nenhum presente cadastrado</h3>
                        <p className="text-gray-500 mb-6">Comece adicionando itens que os convidados possam escolher.</p>
                        <button
                            onClick={() => { setSelectedGift(null); setIsModalOpen(true); }}
                            className="text-rose-600 font-bold hover:underline"
                        >
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
                                    <div className="flex justify-between items-center">
                                        <p className="text-rose-600 font-black">R$ {gift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        {gift.temCotas && (
                                            <span className="text-xs text-gray-400 font-bold">{gift.cotasVendidas || 0}/{gift.totalCotas} cotas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE VISUALIZAÇÃO (Mantido do seu original com ajustes) */}
            {viewingGift && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="relative h-64">
                            <img src={viewingGift.imagemUrl || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setViewingGift(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-all">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{viewingGift.nome}</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Valor Total</span>
                                    <span className="font-bold text-gray-900">R$ {viewingGift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Cotas Compradas</span>
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