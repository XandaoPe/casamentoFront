// src/components/Invite/GiftListSection.tsx
import React, { useState } from 'react';
import { PresenteCota } from '../../types/invite.types';
import { GiftIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface GiftListSectionProps {
    presentes: PresenteCota[];
    // Atualizado para enviar os novos campos exigidos pelo backend
    onComprarCota?: (giftId: string, quantidade: number, nome: string, mensagem: string) => void;
}

const GiftListSection: React.FC<GiftListSectionProps> = ({ presentes, onComprarCota }) => {
    const [selectedGift, setSelectedGift] = useState<any | null>(null);
    const [step, setStep] = useState(1); // 1: Cotas, 2: Identificação
    const [quantidade, setQuantidade] = useState(1);
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleConfirmarFinal = () => {
        if (!nome.trim()) {
            alert("Por favor, informe seu nome para os noivos.");
            return;
        }

        if (selectedGift && onComprarCota) {
            onComprarCota(selectedGift._id, quantidade, nome, mensagem);
            // Resetar estados
            setSelectedGift(null);
            setStep(1);
            setQuantidade(1);
            setNome('');
            setMensagem('');
        }
    };

    const fecharModal = () => {
        setSelectedGift(null);
        setStep(1);
        setQuantidade(1);
        setNome('');
        setMensagem('');
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
                    {presentes.map((presente: any) => {
                        const vTotal = presente.valorTotal || 0;
                        const tCotas = presente.totalCotas || 1;
                        const cVendidas = presente.cotasVendidas || 0;
                        const valorUnitarioCota = vTotal / tCotas;
                        const disponiveis = Math.max(0, tCotas - cVendidas);
                        const percentualComprado = (cVendidas / tCotas) * 100;

                        return (
                            <div key={presente._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                                {presente.imagemUrl && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img src={presente.imagemUrl} alt={presente.nome} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{presente.nome}</h3>
                                    <div className="space-y-3 mb-5 mt-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                                {presente.temCotas ? 'Cota unitária' : 'Valor Total'}
                                            </span>
                                            <span className="font-bold text-gold text-lg">
                                                R$ {valorUnitarioCota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-gray-500">{disponiveis} disponíveis</span>
                                                <span className="text-gold">{percentualComprado.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="bg-gold h-2 rounded-full transition-all duration-1000" style={{ width: `${percentualComprado}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        disabled={disponiveis === 0}
                                        onClick={() => { setSelectedGift(presente); setStep(1); }}
                                        className={`w-full py-2.5 text-sm font-bold rounded-xl transition-all ${disponiveis === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gold hover:bg-gold/90 text-white'}`}
                                    >
                                        {disponiveis === 0 ? 'Esgotado' : 'Presentear'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MODAL EVOLUÍDO */}
                {selectedGift && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    {step === 2 && (
                                        <button onClick={() => setStep(1)} className="p-1 hover:bg-gray-100 rounded-full">
                                            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                                        </button>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {step === 1 ? 'Quantas cotas?' : 'Quase lá!'}
                                    </h3>
                                </div>
                                <button onClick={fecharModal} className="p-2 -mr-2">
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Item selecionado</p>
                                            <p className="font-semibold text-gray-800">{selectedGift.nome}</p>
                                        </div>
                                        <p className="font-bold text-gold">
                                            R$ {(selectedGift.valorTotal / selectedGift.totalCotas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">-</button>
                                        <span className="flex-grow text-center text-xl font-bold text-gray-800">{quantidade}</span>
                                        <button onClick={() => {
                                            const max = selectedGift.totalCotas - selectedGift.cotasVendidas;
                                            setQuantidade(Math.min(max, quantidade + 1));
                                        }} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">+</button>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-gray-600 font-medium">Total:</span>
                                            <span className="text-2xl font-black text-gray-900">
                                                R$ {((selectedGift.valorTotal / selectedGift.totalCotas) * quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <button onClick={() => setStep(2)} className="w-full bg-gold text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                                            Próximo passo <ChevronRightIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome Completo</label>
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Ex: João e Maria Silva"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem aos Noivos (Opcional)</label>
                                        <textarea
                                            value={mensagem}
                                            onChange={(e) => setMensagem(e.target.value)}
                                            placeholder="Deixe um recado carinhoso..."
                                            rows={3}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:outline-none resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleConfirmarFinal}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all mt-4"
                                    >
                                        Confirmar e Presentear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GiftListSection;