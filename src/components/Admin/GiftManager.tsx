// src/components/Admin/GiftManager.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const GiftManager = () => {
    const [form, setForm] = useState({
        nome: '',
        valorTotal: 0,
        temCotas: false,
        totalCotas: 1,
        imagemUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/gifts/admin', form);
            toast.success('Presente adicionado!');
        } catch (error) {
            toast.error('Erro ao salvar');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg space-y-4">
            <h2 className="text-xl font-bold">Novo Presente na Lista</h2>
            <input
                placeholder="Nome do Presente"
                className="w-full p-2 border rounded"
                onChange={e => setForm({ ...form, nome: e.target.value })}
            />
            <input
                type="number"
                placeholder="Valor Total (Ex: 3000)"
                className="w-full p-2 border rounded"
                onChange={e => setForm({ ...form, valorTotal: Number(e.target.value) })}
            />

            <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                <input
                    type="checkbox"
                    id="cotas"
                    onChange={e => setForm({ ...form, temCotas: e.target.checked })}
                />
                <label htmlFor="cotas" className="text-sm font-medium">Habilitar Divisão por Cotas?</label>
            </div>

            {form.temCotas && (
                <div className="animate-fade-in">
                    <label className="text-xs text-gray-500 uppercase">Quantidade de Cotas</label>
                    <input
                        type="number"
                        placeholder="Ex: 20"
                        className="w-full p-2 border rounded border-rose-200"
                        onChange={e => setForm({ ...form, totalCotas: Number(e.target.value) })}
                    />
                    <p className="text-[10px] text-rose-500 mt-1">
                        Cada cota custará: R$ {(form.valorTotal / form.totalCotas).toFixed(2)}
                    </p>
                </div>
            )}

            <button type="submit" className="w-full bg-rose-600 text-white py-2 rounded-lg font-bold">
                Publicar Presente
            </button>
        </form>
    );
};