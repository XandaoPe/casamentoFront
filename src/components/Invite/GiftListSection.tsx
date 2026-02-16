// src/components/Invite/GiftListSection.tsx
import React, { useState } from 'react';
import { PresenteCota } from '../../types/invite.types';
import { GiftIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GiftListSectionProps {
    presentes: PresenteCota[];
    onComprarCota?: (presente: PresenteCota, quantidade: number) => void;
}

const GiftListSection: React.FC<GiftListSectionProps> = ({ presentes, onComprarCota }) => {
    const [selectedGift, setSelectedGift] = useState<PresenteCota | null>(null);
    const [quantidade, setQuantidade] = useState(1);

    const handleComprar = () => {
        if (selectedGift && onComprarCota) {
            onComprarCota(selectedGift, quantidade);
            setSelectedGift(null);
            setQuantidade(1);
        }
    };

    return (
        <section className="py-12 md:py-20 bg-white" id="presentes">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <GiftIcon className="h-10 w-10 text-gold mx-auto mb-3" />
                    <h2 className="font-script text-4xl md:text-5xl text-gray-800 mb-4">
                        Lista de Presentes
                    </h2>
                    <div className="w-16 h-1 bg-gold mx-auto mb-6" />
                    <p className="text-gray-600 max-w-lg mx-auto px-2">
                        Sua presença é o maior presente, mas se desejar nos presentear, escolha um item abaixo.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {presentes.map((presente) => {
                        const total = presente.cotasCompradas + presente.cotasDisponiveis;
                        const percentualComprado = total > 0 ? (presente.cotasCompradas / total) * 100 : 0;

                        return (
                            <div key={presente.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                                {presente.imagem && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={presente.imagem}
                                            alt={presente.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                                        {presente.nome}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-2">
                                        {presente.descricao}
                                    </p>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Cota unitária</span>
                                            <span className="font-bold text-gold text-lg">
                                                R$ {presente.valorCota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-gray-500">{presente.cotasDisponiveis} disponíveis</span>
                                                <span className="text-gold">{percentualComprado.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-gold h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${percentualComprado}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedGift(presente); setQuantidade(1); }}
                                            className="flex-grow btn-primary py-2.5 text-sm"
                                        >
                                            Presentear
                                        </button>
                                        {presente.linkExterno && (
                                            <a
                                                href={presente.linkExterno}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary px-3 py-2.5"
                                                title="Ver na loja"
                                            >
                                                <ShoppingBagIcon className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal de Compra - Mobile Friendly */}
                {selectedGift && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Escolher Cotas</h3>
                                <button onClick={() => setSelectedGift(null)} className="p-2 -mr-2">
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Item selecionado</p>
                                        <p className="font-semibold text-gray-800">{selectedGift.nome}</p>
                                    </div>
                                    <p className="font-bold text-gold">R$ {selectedGift.valorCota.toFixed(2)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        Quantas cotas deseja dar?
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 active:bg-gray-100"
                                        >-</button>
                                        <input
                                            type="number"
                                            readOnly
                                            value={quantidade}
                                            className="flex-grow text-center text-xl font-bold border-none bg-transparent"
                                        />
                                        <button
                                            onClick={() => setQuantidade(Math.min(selectedGift.cotasDisponiveis, quantidade + 1))}
                                            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 active:bg-gray-100"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-600 font-medium">Total do Presente:</span>
                                        <span className="text-2xl font-black text-gray-900">
                                            R$ {(selectedGift.valorCota * quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <button onClick={handleComprar} className="w-full btn-primary">
                                        Confirmar Presente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GiftListSection;