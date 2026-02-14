// src/components/Admin/GuestFilters.tsx
import React from 'react';
import { FunnelIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface GuestFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterGrupo: string;
    setFilterGrupo: (value: string) => void;
    filterConfirmado: string;
    setFilterConfirmado: (value: string) => void;
    filterPresente: string;
    setFilterPresente: (value: string) => void;
    grupos: string[];
    onRefresh: () => void;
    loading: boolean;
}

const GuestFilters: React.FC<GuestFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterGrupo,
    setFilterGrupo,
    filterConfirmado,
    setFilterConfirmado,
    filterPresente,
    setFilterPresente,
    grupos,
    onRefresh,
    loading
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Busca */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                </div>

                {/* Filtro por Grupo */}
                <div className="relative">
                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={filterGrupo}
                        onChange={(e) => setFilterGrupo(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none"
                    >
                        <option value="">Todos os grupos</option>
                        {grupos.map(grupo => (
                            <option key={grupo} value={grupo}>{grupo}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Status */}
                <div className="relative">
                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={filterConfirmado}
                        onChange={(e) => setFilterConfirmado(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none"
                    >
                        <option value="">Todos os status</option>
                        <option value="true">Confirmados</option>
                        <option value="false">Não confirmados</option>
                    </select>
                </div>

                {/* Filtro por Presente */}
                <div className="relative">
                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={filterPresente}
                        onChange={(e) => setFilterPresente(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none"
                    >
                        <option value="">Todos os presentes</option>
                        <option value="sim">Com presente</option>
                        <option value="nao">Sem presente</option>
                    </select>
                </div>

                {/* Botão Recarregar */}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                    <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Recarregar
                </button>
            </div>
        </div>
    );
};

export default GuestFilters;