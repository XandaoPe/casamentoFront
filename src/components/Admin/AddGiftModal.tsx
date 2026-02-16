// src/components/Admin/AddGiftModal.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    gift?: any; // Recebe o presente para edição (opcional)
}

const AddGiftModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, gift }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        valorTotal: 0,
        temCotas: false,
        totalCotas: 1,
        imagemUrl: '',
        ativo: true
    });

    // Efeito para preencher o formulário quando for edição
    useEffect(() => {
        if (gift) {
            setForm({
                nome: gift.nome || '',
                valorTotal: gift.valorTotal || 0,
                temCotas: gift.temCotas || false,
                totalCotas: gift.totalCotas || 1,
                imagemUrl: gift.imagemUrl || '',
                ativo: gift.ativo ?? true
            });
        } else {
            // Resetar formulário para novo presente
            setForm({
                nome: '',
                valorTotal: 0,
                temCotas: false,
                totalCotas: 1,
                imagemUrl: '',
                ativo: true
            });
        }
    }, [gift, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (gift?._id) {
                // Modo Edição
                await api.put(`/gifts/admin/${gift._id}`, form);
                toast.success('Presente atualizado com sucesso!');
            } else {
                // Modo Cadastro
                await api.post('/gifts/admin', form);
                toast.success('Presente cadastrado com sucesso!');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(gift?._id ? 'Erro ao atualizar presente' : 'Erro ao cadastrar presente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {gift ? 'Editar Presente' : 'Novo Presente'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Presente</label>
                        <input
                            required
                            className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            value={form.nome}
                            onChange={e => setForm({ ...form, nome: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor Total (R$)</label>
                            <input
                                type="number"
                                required
                                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                value={form.valorTotal}
                                onChange={e => setForm({ ...form, valorTotal: Number(e.target.value) })}
                            />
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-rose-600 rounded"
                                    checked={form.temCotas}
                                    onChange={e => setForm({ ...form, temCotas: e.target.checked })}
                                />
                                <span className="text-sm font-medium text-gray-700">Usar Cotas?</span>
                            </label>
                        </div>
                    </div>

                    {form.temCotas && (
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                            <label className="block text-sm font-medium text-rose-700">Quantidade de Cotas</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full mt-1 border border-rose-200 p-2 rounded-lg focus:ring-rose-500 outline-none"
                                value={form.totalCotas}
                                onChange={e => setForm({ ...form, totalCotas: Number(e.target.value) })}
                            />
                            <p className="mt-2 text-xs text-rose-600 font-bold">
                                Valor por cota: R$ {(form.valorTotal / (form.totalCotas || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL da Imagem (Opcional)</label>
                        <input
                            className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            value={form.imagemUrl}
                            onChange={e => setForm({ ...form, imagemUrl: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="ativo"
                            className="w-4 h-4 text-rose-600 rounded"
                            checked={form.ativo}
                            onChange={e => setForm({ ...form, ativo: e.target.checked })}
                        />
                        <label htmlFor="ativo" className="text-sm font-medium text-gray-700 cursor-pointer">Presente Visível no Site</label>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : gift ? 'Salvar Alterações' : 'Cadastrar Presente'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGiftModal;