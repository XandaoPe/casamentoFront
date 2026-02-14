// src/components/Admin/GuestTable.tsx
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
    onSendInvitation: (guest: Guest, method: 'email' | 'sms' | 'whatsapp') => void;
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
    onSendInvitation,
    sending
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8">
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
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedGuests.length === guests.length && guests.length > 0}
                                    onChange={onSelectAll}
                                    className="rounded border-gray-300 text-gold focus:ring-gold"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contato
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grupo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acompanhantes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Convite
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
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
                                    <div className="text-sm font-medium text-gray-900">
                                        {guest.nome}
                                    </div>
                                    {guest.observacoes && (
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {guest.observacoes}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{guest.email}</div>
                                    <div className="text-sm text-gray-500">{formatPhone(guest.telefone)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                        {guest.grupo}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {guest.confirmado ? (
                                        <span className="flex items-center text-sm text-green-600">
                                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                                            Confirmado
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-sm text-gray-400">
                                            <XCircleIcon className="h-4 w-4 mr-1" />
                                            Pendente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {guest.confirmado ? guest.numAcompanhantes : '-'} / {guest.maxAcompanhantes}
                                </td>
                                <td className="px-6 py-4">
                                    {guest.conviteEnviado ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            Enviado
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                            Pendente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => onViewDetails(guest)}
                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                        title="Ver detalhes"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onSendInvitation(guest, 'whatsapp')}
                                        disabled={sending}
                                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                                        title="Enviar WhatsApp"
                                    >
                                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onSendInvitation(guest, 'email')}
                                        disabled={sending}
                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                                        title="Enviar Email"
                                    >
                                        <EnvelopeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onSendInvitation(guest, 'sms')}
                                        disabled={sending}
                                        className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                                        title="Enviar SMS"
                                    >
                                        <DevicePhoneMobileIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(guest)}
                                        className="p-1 text-gold hover:text-gold/80 hover:bg-gold/10 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(guest._id)}
                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
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