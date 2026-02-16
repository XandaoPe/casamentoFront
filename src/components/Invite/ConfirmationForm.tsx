// src/components/Invite/ConfirmationForm.tsx
import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ConfirmationFormProps {
    onSubmit: (data: any) => Promise<void>;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        confirmado: true,
        mensagem: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit({ ...formData, numAcompanhantes: 0 });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-xl mx-auto">
            {/* Barra de Progresso Superior */}
            <div className="h-1.5 w-full bg-gray-100">
                <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: step === 1 ? '50%' : '100%' }}
                />
            </div>

            <div className="p-6 md:p-10">
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Você poderá ir?</h3>
                            <p className="text-gray-500">Sua resposta é muito importante para nós.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => { setFormData({ ...formData, confirmado: true }); setStep(2); }}
                                className={`flex items-center p-5 rounded-2xl border-2 transition-all ${formData.confirmado ? 'border-gold bg-gold/5 ring-4 ring-gold/10' : 'border-gray-100'
                                    }`}
                            >
                                <CheckCircleIcon className={`h-10 w-10 ${formData.confirmado ? 'text-gold' : 'text-gray-300'}`} />
                                <div className="ml-4 text-left">
                                    <span className="block font-bold text-gray-800 text-lg">Sim, eu vou!</span>
                                    <span className="text-sm text-gray-500">Mal posso esperar pelo grande dia.</span>
                                </div>
                            </button>

                            <button
                                onClick={() => { setFormData({ ...formData, confirmado: false }); setStep(2); }}
                                className={`flex items-center p-5 rounded-2xl border-2 transition-all ${!formData.confirmado ? 'border-red-500 bg-red-50 ring-4 ring-red-500/10' : 'border-gray-100'
                                    }`}
                            >
                                <XCircleIcon className={`h-10 w-10 ${!formData.confirmado ? 'text-red-500' : 'text-gray-300'}`} />
                                <div className="ml-4 text-left">
                                    <span className="block font-bold text-gray-800 text-lg">Infelizmente não</span>
                                    <span className="text-sm text-gray-500">Não poderei comparecer desta vez.</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {formData.confirmado ? 'Que alegria!' : 'Sentiremos sua falta!'}
                            </h3>
                            <p className="text-gray-500 text-sm">Deixe um recado especial para os noivos.</p>
                        </div>

                        <textarea
                            value={formData.mensagem}
                            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                            rows={5}
                            className="input-field resize-none"
                            placeholder="Escreva aqui sua mensagem de carinho..."
                        />

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 btn-secondary flex items-center justify-center gap-2"
                            >
                                <ArrowLeftIcon className="h-5 w-5" /> Voltar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-[2] btn-primary flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Enviando...' : (
                                    <>Confirmar <ArrowRightIcon className="h-5 w-5" /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmationForm;