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
    XMarkIcon
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

    // Estado para o Modal de Visualização (Ação do Olho)
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
                            <p className="text-gray-500 text-sm">Exibindo todos os registros do banco de dados</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setSelectedGift(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Cadastrar Novo Presente
                    </button>
                </div>

                {/* Tabela de Presentes - Sem Filtros */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Presente</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor Total</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cotas</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-10 font-medium text-gray-400 italic">Carregando dados...</td></tr>
                                ) : gifts.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhum presente encontrado no banco de dados.</td></tr>
                                ) : gifts.map((gift: any) => (
                                    <tr key={gift._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={gift.imagemUrl || 'https://via.placeholder.com/40?text=Gift'}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                                    alt=""
                                                />
                                                <span className="font-medium text-gray-800">{gift.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            R$ {gift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {gift.temCotas ? (
                                                <span className="text-sm inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
                                                    {gift.cotasVendidas || 0} / {gift.totalCotas}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Integral</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${gift.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {gift.ativo ? 'ATIVO' : 'INATIVO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <button
                                                onClick={() => setViewingGift(gift)}
                                                title="Visualizar Detalhes"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(gift)}
                                                title="Editar Presente"
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(gift._id)}
                                                title="Excluir Presente"
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL DE VISUALIZAÇÃO */}
            {viewingGift && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setViewingGift(null)} className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full hover:bg-white shadow-md transition-all">
                            <XMarkIcon className="h-6 w-6 text-gray-800" />
                        </button>

                        <div className="h-56 bg-gray-100">
                            <img
                                src={viewingGift.imagemUrl || 'https://via.placeholder.com/400?text=Sem+Imagem'}
                                className="w-full h-full object-cover"
                                alt={viewingGift.nome}
                            />
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{viewingGift.nome}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${viewingGift.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${viewingGift.ativo ? 'text-green-600' : 'text-red-600'}`}>
                                            {viewingGift.ativo ? 'Visível para convidados' : 'Oculto para convidados'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Valor Total</p>
                                    <p className="text-2xl font-black text-rose-600">R$ {viewingGift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Sistema de Cotas</p>
                                    <p className="text-sm font-semibold text-gray-700">{viewingGift.temCotas ? 'Ativado' : 'Desativado'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Vendas</p>
                                    <p className="text-sm font-semibold text-rose-600">{viewingGift.cotasVendidas || 0} de {viewingGift.totalCotas} cotas</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={() => setViewingGift(null)}
                                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                            >
                                Fechar
                            </button>
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