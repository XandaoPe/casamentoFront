// src/components/Admin/BulkInviteModal.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BulkInviteModalProps {
    selectedCount: number;
    method: 'email' | 'sms';
    setMethod: (method: 'email' | 'sms') => void;
    onConfirm: () => Promise<void>;
    onClose: () => void;
    sending: boolean;
}

const BulkInviteModal: React.FC<BulkInviteModalProps> = ({
    selectedCount,
    method,
    setMethod,
    onConfirm,
    onClose,
    sending
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Enviar Convites em Massa
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Você está enviando convites para <strong>{selectedCount}</strong> {selectedCount === 1 ? 'convidado' : 'convidados'}.
                    </p>

                    <div className="space-y-4 mb-6">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 mb-2 block">
                                Método de envio
                            </span>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value as 'email' | 'sms')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                                disabled={sending}
                            >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={sending}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={sending}
                            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                        >
                            {sending ? 'Enviando...' : 'Confirmar Envio'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkInviteModal;