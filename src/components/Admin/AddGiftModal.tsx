// src/components/Admin/AddGiftModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhotoIcon, LinkIcon, CameraIcon } from '@heroicons/react/24/outline';
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
        imagemUrl: '', // Pode ser a URL final ou o preview da imagem local
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
            imagemUrl: '',
            ativo: true
        });
        setSelectedFile(null);
    };

    // Lida com a seleção de arquivo local (Galeria ou Câmera)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Cria um preview local para o usuário ver antes de salvar
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
            // Usamos FormData para permitir o envio do arquivo
            const data = new FormData();
            data.append('nome', formData.nome);
            data.append('valorTotal', formData.valorTotal);
            data.append('temCotas', String(formData.temCotas));
            data.append('totalCotas', formData.totalCotas);
            data.append('ativo', String(formData.ativo));

            if (selectedFile) {
                data.append('image', selectedFile); // Envia o arquivo físico
            } else {
                data.append('imagemUrl', formData.imagemUrl); // Envia apenas a URL se não houver arquivo
            }

            if (gift?._id) {
                await api.put(`/gifts/admin/${gift._id}`, data);
                toast.success('Atualizado com sucesso!');
            } else {
                await api.post('/gifts/admin', data);
                toast.success('Criado com sucesso!');
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        {gift ? 'Editar Presente' : 'Novo Presente'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* AREA DE UPLOAD / PREVIEW RESPONSIVO */}
                    <div className="relative group w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-rose-300">
                        {formData.imagemUrl ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={formData.imagemUrl}
                                    className="w-full h-full object-contain bg-white"
                                    alt="Preview"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, imagemUrl: '' });
                                        setSelectedFile(null);
                                    }}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all"
                                    >
                                        <CameraIcon className="h-8 w-8" />
                                        <span className="text-[10px] font-bold mt-1">Câmera</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl hover:bg-blue-100 transition-all"
                                    >
                                        <PhotoIcon className="h-8 w-8" />
                                        <span className="text-[10px] font-bold mt-1">Galeria</span>
                                    </button>
                                </div>
                                <p className="text-xs font-semibold text-gray-400">Arraste uma foto ou escolha uma opção</p>
                            </div>
                        )}
                        {/* Input escondido para disparar o seletor de arquivos */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* CAMPO DE URL MANUAL */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            <LinkIcon className="h-3 w-3" /> Ou Cole a URL da Imagem
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-rose-500"
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={formData.imagemUrl.startsWith('data:') ? '' : formData.imagemUrl}
                            onChange={(e) => {
                                setFormData({ ...formData, imagemUrl: e.target.value });
                                setSelectedFile(null);
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Item</label>
                            <input
                                required
                                type="text"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-rose-500"
                                placeholder="Ex: Smart TV 50 Pol"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Valor (R$)</label>
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cotas</label>
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl transition-all uppercase text-xs tracking-widest"
                        >
                            {loading ? 'Processando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGiftModal;