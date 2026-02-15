// src/components/Invite/GiftListSection.tsx
import React, { useState } from 'react';
import { PresenteCota } from '../../types/invite.types';
import { GiftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

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
        <section className="py-16 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <GiftIcon className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-4">
                        Lista de Presentes
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto mb-4" />
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Escolha um presente para nos ajudar a construir nosso novo lar.
                        Você pode contribuir com cotas ou comprar o presente completo.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {presentes.map((presente) => {
                        const percentualComprado = (presente.cotasCompradas / (presente.cotasCompradas + presente.cotasDisponiveis)) * 100;

                        return (
                            <div key={presente.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                {presente.imagem && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={presente.imagem}
                                            alt={presente.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {presente.nome}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {presente.descricao}
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Valor total:</span>
                                            <span className="font-semibold">
                                                R$ {presente.valorTotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Cota:</span>
                                            <span className="font-semibold text-gold">
                                                R$ {presente.valorCota.toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Barra de progresso */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Disponível: {presente.cotasDisponiveis} cotas</span>
                                                <span>{percentualComprado.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gold h-2 rounded-full"
                                                    style={{ width: `${percentualComprado}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedGift(presente)}
                                            className="flex-1 bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                                        >
                                            Comprar Cota
                                        </button>
                                        {presente.linkExterno && (
                                            <a
                                                href={presente.linkExterno}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                title="Ver na loja"
                                            >
                                                <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal de compra de cota */}
                {selectedGift && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Comprar Cota - {selectedGift.nome}
                            </h3>

                            <div className="space-y-4 mb-6">
                                <p className="text-sm text-gray-600">
                                    Valor da cota: <span className="font-semibold text-gold">R$ {selectedGift.valorCota.toFixed(2)}</span>
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantidade de cotas (máx: {selectedGift.cotasDisponiveis})
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedGift.cotasDisponiveis}
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                    />
                                </div>

                                <div className="bg-rose-50 p-4 rounded-lg">
                                    <p className="flex justify-between text-sm">
                                        <span>Valor total:</span>
                                        <span className="font-semibold">
                                            R$ {(selectedGift.valorCota * quantidade).toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedGift(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleComprar}
                                    className="flex-1 bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GiftListSection;