// src/components/Invite/ConfirmationForm.tsx
import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ConfirmationFormProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel?: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ onSubmit, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        confirmado: true,
        mensagem: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const dataToSend = {
                confirmado: formData.confirmado,
                numAcompanhantes: 0,
                mensagem: formData.mensagem
            };
            console.log('Enviando dados:', dataToSend); // Debug
            await onSubmit(dataToSend);
        } catch (error) {
            console.error('Erro no formulário:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Steps */}
            <div className="flex justify-between mb-8">
                {[1, 2].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 text-center ${s < step ? 'text-gold' : s === step ? 'text-gray-900' : 'text-gray-300'}`}
                    >
                        <div className={`
                            w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2
                            ${s < step ? 'bg-gold text-white' :
                                s === step ? 'bg-gold/20 text-gold border-2 border-gold' :
                                    'bg-gray-100 text-gray-400'}
                        `}>
                            {s}
                        </div>
                        <span className="text-sm">
                            {s === 1 ? 'Presença' : 'Mensagem'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 1: Confirmação */}
            {step === 1 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center mb-6">
                        Você vai comparecer?
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setFormData(prev => ({ ...prev, confirmado: true }));
                                setStep(2);
                            }}
                            className={`
                                p-6 rounded-xl border-2 transition-all
                                ${formData.confirmado
                                    ? 'border-gold bg-gold/5'
                                    : 'border-gray-200 hover:border-gold/50'}
                            `}
                        >
                            <CheckCircleIcon className={`h-8 w-8 mx-auto mb-2 ${formData.confirmado ? 'text-gold' : 'text-gray-400'}`} />
                            <span className={`block font-medium ${formData.confirmado ? 'text-gold' : 'text-gray-600'}`}>
                                Vou Comparecer
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setFormData(prev => ({ ...prev, confirmado: false }));
                                setStep(2);
                            }}
                            className={`
                                p-6 rounded-xl border-2 transition-all
                                ${!formData.confirmado
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 hover:border-red-500/50'}
                            `}
                        >
                            <XCircleIcon className={`h-8 w-8 mx-auto mb-2 ${!formData.confirmado ? 'text-red-500' : 'text-gray-400'}`} />
                            <span className={`block font-medium ${!formData.confirmado ? 'text-red-500' : 'text-gray-600'}`}>
                                Não Poderei Ir
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Mensagem */}
            {step === 2 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center mb-6">
                        {formData.confirmado ? 'Quase lá! Deixe uma mensagem' : 'Que pena! Deixe uma mensagem'}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.confirmado ? 'Deixe uma mensagem para os noivos (opcional)' : 'Deixe uma mensagem de carinho (opcional)'}
                        </label>
                        <textarea
                            value={formData.mensagem}
                            onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                            placeholder={formData.confirmado ? "Estou ansioso para o grande dia!" : "Infelizmente não poderei comparecer, mas estarei torcendo!"}
                        />
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 && (
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Voltar
                    </button>
                )}

                {step === 1 ? (
                    <div className="ml-auto"></div>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="ml-auto px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50"
                    >
                        {submitting ? 'Confirmando...' : 'Confirmar Presença'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ConfirmationForm;