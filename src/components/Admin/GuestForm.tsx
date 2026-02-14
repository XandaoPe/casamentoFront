// src/components/Admin/GuestForm.tsx
import React, { useState } from 'react';
import { Guest } from '../../types/guest.types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface GuestFormProps {
    guest?: Guest | null;
    grupos: string[];
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ guest, grupos, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        nome: guest?.nome || '',
        email: guest?.email || '',
        telefone: guest?.telefone || '',
        grupo: guest?.grupo || '',
        maxAcompanhantes: guest?.maxAcompanhantes || 2,
        observacoes: guest?.observacoes || ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {guest ? 'Editar Convidado' : 'Novo Convidado'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome *
                            </label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                placeholder="(11) 99999-9999"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grupo *
                            </label>
                            <select
                                value={formData.grupo}
                                onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                required
                            >
                                <option value="">Selecione um grupo</option>
                                {grupos.map(grupo => (
                                    <option key={grupo} value={grupo}>{grupo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Máximo de Acompanhantes *
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={formData.maxAcompanhantes}
                                onChange={(e) => setFormData({ ...formData, maxAcompanhantes: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Observações
                            </label>
                            <textarea
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Salvando...' : (guest ? 'Atualizar' : 'Criar')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GuestForm;