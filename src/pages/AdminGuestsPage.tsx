// src/pages/AdminGuestsPage.tsx (versão atualizada)
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGuests } from '../hooks/useGuests';
import { useInvitations } from '../hooks/useInvitations';
import { Guest } from '../types/guest.types';
import {
    PlusIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import GuestFilters from '../components/Admin/GuestFilters';
import SummaryCards from '../components/Admin/SummaryCards';
import GuestDetailsModal from '../components/Admin/GuestDetailsModal';
import GuestTable from '../components/Admin/GuestTable';
import GuestForm from '../components/Admin/GuestForm';
import BulkInviteModal from '../components/Admin/BulkInviteModal';
import * as XLSX from 'xlsx';

const AdminGuestsPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const {
        guests,
        statistics,
        loading,
        createGuest,
        updateGuest,
        deleteGuest,
        refreshGuests
    } = useGuests();
    const { sending, sendEmail, sendSms, sendWhatsApp, sendBulk } = useInvitations();
    const navigate = useNavigate();

    // Estados
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrupo, setFilterGrupo] = useState<string>('');
    const [filterConfirmado, setFilterConfirmado] = useState<string>('');
    const [filterPresente, setFilterPresente] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkMethod, setBulkMethod] = useState<'email' | 'sms'>('email');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Grupos disponíveis
    const grupos = [
        'Família Noivo',
        'Família Noiva',
        'Amigos Noivo',
        'Amigos Noiva',
        'Trabalho',
        'Outros'
    ];

    // Filtrar convidados
    const filteredGuests = useMemo(() => {
        return guests.filter(guest => {
            const matchesSearch = guest.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.telefone.includes(searchTerm);

            const matchesGrupo = !filterGrupo || guest.grupo === filterGrupo;
            const matchesConfirmado = filterConfirmado === '' ||
                (filterConfirmado === 'true' && guest.confirmado) ||
                (filterConfirmado === 'false' && !guest.confirmado);

            const matchesPresente = filterPresente === '' ||
                (filterPresente === 'sim' && guest.presente) ||
                (filterPresente === 'nao' && !guest.presente);

            return matchesSearch && matchesGrupo && matchesConfirmado && matchesPresente;
        });
    }, [guests, searchTerm, filterGrupo, filterConfirmado, filterPresente]);

    // Paginação
    const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
    const paginatedGuests = filteredGuests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSendEmail = async (guest: Guest) => {
        try {
            await sendEmail(guest._id);
            await refreshGuests();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSendSms = async (guest: Guest) => {
        try {
            await sendSms(guest._id);
            await refreshGuests();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSendWhatsApp = async (guest: Guest) => {
        try {
            await sendWhatsApp(guest._id);
            await refreshGuests();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenModal = (guest?: Guest) => {
        setEditingGuest(guest || null);
        setShowModal(true);
    };

    const handleViewDetails = (guest: Guest) => {
        setViewingGuest(guest);
        setShowDetailsModal(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingGuest) {
                await updateGuest(editingGuest._id, data);
                toast.success('Convidado atualizado com sucesso!');
            } else {
                await createGuest(data);
                toast.success('Convidado criado com sucesso!');
            }
            setShowModal(false);
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este convidado?')) {
            try {
                await deleteGuest(id);
                toast.success('Convidado excluído com sucesso!');
            } catch (error) {
                // Erro já tratado no hook
            }
        }
    };

    const handleBulkSend = async () => {
        if (selectedGuests.length === 0) {
            toast.error('Selecione pelo menos um convidado');
            return;
        }
        setShowBulkModal(true);
    };

    const confirmBulkSend = async () => {
        try {
            await sendBulk(selectedGuests, bulkMethod);
            setShowBulkModal(false);
            setSelectedGuests([]);
            await refreshGuests();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleExportExcel = () => {
        const data = filteredGuests.map(guest => ({
            Nome: guest.nome,
            Email: guest.email,
            Telefone: guest.telefone,
            Grupo: guest.grupo,
            Status: guest.confirmado ? 'Confirmado' : 'Pendente',
            Acompanhantes: guest.confirmado ? guest.numAcompanhantes : '-',
            'Máx Acompanhantes': guest.maxAcompanhantes,
            'Convite Enviado': guest.conviteEnviado ? 'Sim' : 'Não',
            'Data Envio': guest.dataEnvioConvite ? new Date(guest.dataEnvioConvite).toLocaleDateString() : '-',
            Presente: guest.presente?.nome || '-',
            'Valor Presente': guest.presente?.valor || '-',
            Observações: guest.observacoes || '-'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Convidados');
        XLSX.writeFile(wb, `convidados_${new Date().toISOString().split('T')[0]}.xlsx`);

        toast.success('Relatório exportado com sucesso!');
    };

    const toggleSelectAll = () => {
        if (selectedGuests.length === paginatedGuests.length) {
            setSelectedGuests([]);
        } else {
            setSelectedGuests(paginatedGuests.map(g => g._id));
        }
    };

    const toggleSelectGuest = (id: string) => {
        setSelectedGuests(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Controle de Convidados
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total: {filteredGuests.length} convidados
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleExportExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                Exportar Excel
                            </button>

                            {selectedGuests.length > 0 && (
                                <button
                                    onClick={handleBulkSend}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                >
                                    Enviar para {selectedGuests.length} selecionados
                                </button>
                            )}

                            <button
                                onClick={() => handleOpenModal()}
                                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors flex items-center"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Novo Convidado
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cards de Resumo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <SummaryCards statistics={statistics} loading={loading} />
            </div>

            {/* Filtros */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <GuestFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterGrupo={filterGrupo}
                    setFilterGrupo={setFilterGrupo}
                    filterConfirmado={filterConfirmado}
                    setFilterConfirmado={setFilterConfirmado}
                    filterPresente={filterPresente}
                    setFilterPresente={setFilterPresente}
                    grupos={grupos}
                    onRefresh={refreshGuests}
                    loading={loading}
                />
            </div>

            {/* Tabela de Convidados */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <GuestTable
                    guests={paginatedGuests}
                    loading={loading}
                    selectedGuests={selectedGuests}
                    onSelectAll={toggleSelectAll}
                    onSelectGuest={toggleSelectGuest}
                    onViewDetails={handleViewDetails}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    // ✅ Novas props
                    onSendEmail={handleSendEmail}
                    onSendSms={handleSendSms}
                    onSendWhatsApp={handleSendWhatsApp}
                    sending={sending}
                />

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                            {Math.min(currentPage * itemsPerPage, filteredGuests.length)} de{' '}
                            {filteredGuests.length} resultados
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="px-4 py-2 bg-gold text-white rounded-lg">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Criar/Editar Convidado */}
            {showModal && (
                <GuestForm
                    guest={editingGuest}
                    grupos={grupos}
                    onSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}

            {/* Modal de Detalhes */}
            {showDetailsModal && viewingGuest && (
                <GuestDetailsModal
                    guest={viewingGuest}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setViewingGuest(null);
                    }}
                />
            )}

            {/* Modal de Envio em Massa */}
            {showBulkModal && (
                <BulkInviteModal
                    selectedCount={selectedGuests.length}
                    method={bulkMethod}
                    setMethod={setBulkMethod}
                    onConfirm={confirmBulkSend}
                    onClose={() => setShowBulkModal(false)}
                    sending={sending}
                />
            )}
        </div>
    );
};

export default AdminGuestsPage;