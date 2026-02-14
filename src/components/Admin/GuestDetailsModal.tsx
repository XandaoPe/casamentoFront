// src/components/Admin/GuestDetailsModal.tsx
import React from 'react';
import { Guest } from '../../types/guest.types';
import {
    XMarkIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    GiftIcon
} from '@heroicons/react/24/outline';
import { formatPhone, formatDate } from '../../utils/formatters';

interface GuestDetailsModalProps {
    guest: Guest;
    onClose: () => void;
}

const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({ guest, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {guest.nome}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {guest.grupo}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            {guest.confirmado ? (
                                <div className="flex items-center text-green-600">
                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Confirmado</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-gray-400">
                                    <XCircleIcon className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Pendente</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Convite</p>
                            {guest.conviteEnviado ? (
                                <div className="text-sm">
                                    <span className="text-green-600 font-medium">Enviado</span>
                                    {guest.dataEnvioConvite && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            {formatDate(guest.dataEnvioConvite)}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <span className="text-yellow-600 font-medium">Não enviado</span>
                            )}
                        </div>
                    </div>

                    {/* Informações de Contato */}
                    <div className="space-y-3 mb-6">
                        <h3 className="font-medium text-gray-900">Contato</h3>

                        <div className="flex items-center text-gray-600">
                            <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{guest.email}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{formatPhone(guest.telefone)}</span>
                        </div>
                    </div>

                    {/* Acompanhantes */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">Acompanhantes</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Máximo permitido:</span>
                                <span className="font-semibold text-gray-900">{guest.maxAcompanhantes}</span>
                            </div>
                            {guest.confirmado && (
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">Confirmados:</span>
                                    <span className="font-semibold text-green-600">{guest.numAcompanhantes}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Presente */}
                    {guest.presente && (
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">Presente</h3>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <GiftIcon className="h-5 w-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">{guest.presente.nome}</p>
                                        <p className="text-purple-600 font-medium mt-1">
                                            R$ {guest.presente.valor.toFixed(2)}
                                        </p>
                                        {guest.presente.confirmado ? (
                                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                Presente confirmado
                                            </span>
                                        ) : (
                                            <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                Presente selecionado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Restrições Alimentares */}
                    {guest.restricaoAlimentar && guest.restricaoAlimentar.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">Restrições Alimentares</h3>
                            <div className="flex flex-wrap gap-2">
                                {guest.restricaoAlimentar.map((restricao, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                                    >
                                        {restricao}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Observações */}
                    {guest.observacoes && (
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">Observações</h3>
                            <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                                {guest.observacoes}
                            </p>
                        </div>
                    )}

                    {/* Metadata */}
                    {guest.metadata && (
                        <div className="text-xs text-gray-400 border-t pt-4">
                            {guest.metadata.visualizacoes !== undefined && (
                                <p>Visualizações: {guest.metadata.visualizacoes}</p>
                            )}
                            {guest.metadata.ultimoAcesso && (
                                <p>Último acesso: {formatDate(guest.metadata.ultimoAcesso)}</p>
                            )}
                            {guest.confirmadoEm && (
                                <p>Confirmado em: {formatDate(guest.confirmadoEm)}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestDetailsModal;
