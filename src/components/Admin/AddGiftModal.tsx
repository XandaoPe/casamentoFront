// src/components/Admin/AddGiftModal.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddGiftModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        valorTotal: 0,
        temCotas: false,
        totalCotas: 1,
        imagemUrl: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/gifts/admin', form);
            toast.success('Presente cadastrado com sucesso!');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Erro ao cadastrar presente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Presente</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Presente</label>
                        <input required className="w-full mt-1 border p-2 rounded-lg"
                            onChange={e => setForm({ ...form, nome: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor Total (R$)</label>
                            <input type="number" required className="w-full mt-1 border p-2 rounded-lg"
                                onChange={e => setForm({ ...form, valorTotal: Number(e.target.value) })} />
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-rose-600"
                                    onChange={e => setForm({ ...form, temCotas: e.target.checked })} />
                                <span className="text-sm font-medium text-gray-700">Usar Cotas?</span>
                            </label>
                        </div>
                    </div>

                    {form.temCotas && (
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 animate-in fade-in zoom-in duration-300">
                            <label className="block text-sm font-medium text-rose-700">Quantidade de Cotas</label>
                            <input type="number" min="1" className="w-full mt-1 border border-rose-200 p-2 rounded-lg"
                                onChange={e => setForm({ ...form, totalCotas: Number(e.target.value) })} />
                            <p className="mt-2 text-xs text-rose-600 font-bold">
                                Valor por cota: R$ {(form.valorTotal / (form.totalCotas || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL da Imagem (Opcional)</label>
                        <input className="w-full mt-1 border p-2 rounded-lg"
                            onChange={e => setForm({ ...form, imagemUrl: e.target.value })} />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition shadow-lg">
                        {loading ? 'Salvando...' : 'Cadastrar Presente'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGiftModal;