// src/pages/AdminGiftsPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { GiftIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AddGiftModal from '../components/Admin/AddGiftModal';

const AdminGiftsPage: React.FC = () => {
    const navigate = useNavigate();
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadGifts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gifts'); // Rota pública ou admin, dependendo da sua preferência
            setGifts(response.data);
        } catch (error) {
            toast.error('Erro ao carregar presentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadGifts(); }, []);

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
                {/* Header da Página */}
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
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg hover:shadow-rose-200"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Cadastrar Novo Presente
                    </button>
                </div>

                {/* Tabela de Presentes */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Presente</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor Total</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cotas</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">Carregando...</td></tr>
                                ) : gifts.map((gift: any) => (
                                    <tr key={gift._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {gift.imagemUrl ? (
                                                    <img src={gift.imagemUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600"><GiftIcon className="h-6 w-6" /></div>
                                                )}
                                                <span className="font-medium text-gray-800">{gift.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            R$ {gift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {gift.temCotas ? (
                                                <div className="text-sm">
                                                    <span className="text-rose-600 font-bold">{gift.cotasVendidas}</span>
                                                    <span className="text-gray-400"> / {gift.totalCotas} vendidas</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Integral</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${gift.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {gift.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button title="Ver no site" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><EyeIcon className="h-5 w-5" /></button>
                                                <button title="Editar" className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><PencilIcon className="h-5 w-5" /></button>
                                                <button onClick={() => handleDelete(gift._id)} title="Excluir" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><TrashIcon className="h-5 w-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddGiftModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadGifts}
            />
        </div>
    );
};

export default AdminGiftsPage;