// src/components/Admin/AddGiftModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhotoIcon, LinkIcon, CameraIcon, CheckCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface AddGiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    gift?: any;
}

const AddGiftModal: React.FC<AddGiftModalProps> = ({ isOpen, onClose, onSuccess, gift }) => {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        nome: '',
        valorTotal: '',
        temCotas: true,
        totalCotas: '1',
        cotasVendidas: '0', // Adicionado para edição manual
        imagemUrl: '',
        ativo: true
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (gift) {
            setFormData({
                nome: gift.nome || '',
                valorTotal: gift.valorTotal?.toString() || '',
                temCotas: gift.temCotas ?? true,
                totalCotas: gift.totalCotas?.toString() || '1',
                cotasVendidas: gift.cotasVendidas?.toString() || '0',
                imagemUrl: gift.imagemUrl || '',
                ativo: gift.ativo ?? true
            });
        } else {
            resetForm();
        }
    }, [gift, isOpen]);

    const resetForm = () => {
        setFormData({
            nome: '',
            valorTotal: '',
            temCotas: true,
            totalCotas: '1',
            cotasVendidas: '0',
            imagemUrl: '',
            ativo: true
        });
        setSelectedFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagemUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('nome', formData.nome);
            data.append('valorTotal', formData.valorTotal);
            data.append('temCotas', String(formData.temCotas));
            data.append('totalCotas', formData.totalCotas);
            data.append('cotasVendidas', formData.cotasVendidas);
            data.append('ativo', String(formData.ativo));

            if (selectedFile) {
                data.append('image', selectedFile);
            } else {
                data.append('imagemUrl', formData.imagemUrl);
            }

            if (gift?._id) {
                await api.put(`/gifts/admin/${gift._id}`, data);
                toast.success('Alterações salvas!');
            } else {
                await api.post('/gifts/admin', data);
                toast.success('Novo presente criado!');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl my-auto animate-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                            {gift ? 'Editar Detalhes' : 'Novo Presente'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Painel Administrativo</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* STATUS E ATIVAÇÃO */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2">
                            {formData.ativo ?
                                <CheckCircleIcon className="h-5 w-5 text-emerald-500" /> :
                                <MinusCircleIcon className="h-5 w-5 text-gray-300" />
                            }
                            <span className={`text-sm font-black uppercase tracking-wider ${formData.ativo ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {formData.ativo ? 'Item Ativo' : 'Item Inativo'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                            className={`w-12 h-6 rounded-full transition-all relative ${formData.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.ativo ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* AREA DE IMAGEM */}
                    <div className="relative group w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-rose-300">
                        {formData.imagemUrl ? (
                            <div className="relative w-full h-full">
                                <img src={formData.imagemUrl} className="w-full h-full object-contain bg-white" alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, imagemUrl: '' }); setSelectedFile(null); }}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                                    <CameraIcon className="h-8 w-8" /><span className="text-[10px] font-bold mt-1">Foto</span>
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl hover:bg-blue-100 transition-all">
                                    <PhotoIcon className="h-8 w-8" /><span className="text-[10px] font-bold mt-1">Galeria</span>
                                </button>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    {/* DEMAIS CAMPOS */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Item</label>
                            <input
                                required
                                type="text"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-rose-500"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Valor Total (R$)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-rose-500"
                                    value={formData.valorTotal}
                                    onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Total de Cotas</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    disabled={!formData.temCotas}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-rose-500 disabled:opacity-30"
                                    value={formData.totalCotas}
                                    onChange={(e) => setFormData({ ...formData, totalCotas: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* NOVO: COTAS VENDIDAS - Apenas na edição */}
                        {gift && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Cotas Reservadas/Vendidas</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={formData.totalCotas}
                                    className="w-full bg-transparent border-b border-amber-200 font-bold text-amber-900 focus:outline-none"
                                    value={formData.cotasVendidas}
                                    onChange={(e) => setFormData({ ...formData, cotasVendidas: e.target.value })}
                                />
                                <p className="text-[9px] text-amber-500 mt-1">* Altere aqui se precisar liberar cotas ou registrar manualmente.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-6 h-6 rounded-lg text-rose-500 border-gray-300 focus:ring-rose-500"
                            checked={formData.temCotas}
                            onChange={(e) => setFormData({ ...formData, temCotas: e.target.checked })}
                        />
                        <span className="text-sm font-bold text-gray-600">Dividir presente em cotas</span>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs tracking-widest">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl transition-all uppercase text-xs tracking-widest"
                        >
                            {loading ? 'Salvando...' : 'Confirmar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGiftModal;