import React from 'react';
import {
    PencilIcon,
    TrashIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { Guest } from '../../types/guest.types';
import { formatPhone } from '../../utils/formatters';

interface GuestTableProps {
    guests: Guest[];
    loading: boolean;
    selectedGuests: string[];
    onSelectAll: () => void;
    onSelectGuest: (id: string) => void;
    onViewDetails: (guest: Guest) => void;
    onEdit: (guest: Guest) => void;
    onDelete: (id: string) => void;
    onSendEmail: (guest: Guest) => void;
    onSendSms: (guest: Guest) => void;
    onSendWhatsApp: (guest: Guest) => void;
    sending: boolean;
}

const GuestTable: React.FC<GuestTableProps> = ({
    guests,
    loading,
    selectedGuests,
    onSelectAll,
    onSelectGuest,
    onViewDetails,
    onEdit,
    onDelete,
    onSendEmail,
    onSendSms,
    onSendWhatsApp,
    sending
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
                </div>
            </div>
        );
    }

    if (guests.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">Nenhum convidado encontrado</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left w-10">
                                <input
                                    type="checkbox"
                                    checked={selectedGuests.length === guests.length && guests.length > 0}
                                    onChange={onSelectAll}
                                    className="rounded border-gray-300 text-gold focus:ring-gold"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presença</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vagas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Convite</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {guests.map((guest) => (
                            <tr key={guest._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedGuests.includes(guest._id)}
                                        onChange={() => onSelectGuest(guest._id)}
                                        className="rounded border-gray-300 text-gold focus:ring-gold"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{guest.nome}</div>
                                    {guest.observacoes && (
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{guest.observacoes}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="text-gray-900">{guest.email}</div>
                                    <div className="text-gray-500">{formatPhone(guest.telefone)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                        {guest.grupo}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {guest.confirmado ? (
                                        <span className="flex items-center text-sm text-green-600 font-medium">
                                            <CheckCircleIcon className="h-4 w-4 mr-1" /> Confirmado
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-sm text-gray-400">
                                            <XCircleIcon className="h-4 w-4 mr-1" /> Pendente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {guest.confirmado ? guest.numAcompanhantes : '0'} / {guest.maxAcompanhantes}
                                </td>
                                <td className="px-6 py-4">
                                    {/* AQUI É ONDE O STATUS MUDA */}
                                    {guest.conviteEnviado ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Enviado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            Pendente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-1">
                                    <button
                                        onClick={() => onViewDetails(guest)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Ver Detalhes"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>

                                    {/* Botão WhatsApp */}
                                    <button
                                        onClick={() => onSendWhatsApp(guest)}
                                        disabled={sending}
                                        className={`p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors ${sending ? 'animate-pulse' : ''}`}
                                        title="Enviar WhatsApp"
                                    >
                                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={() => onSendEmail(guest)}
                                        disabled={sending}
                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Enviar Email"
                                    >
                                        <EnvelopeIcon className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={() => onEdit(guest)}
                                        className="p-1.5 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={() => onDelete(guest._id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestTable;