// src/hooks/useGuests.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { guestsService } from '../services/guests.service';
import { Guest, GuestStatistics, CreateGuestDto, UpdateGuestDto } from '../types/guest.types';
import { toast } from 'react-hot-toast';

export const useGuests = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [statistics, setStatistics] = useState<GuestStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs para controle de timer
    const loadGuestsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const statisticsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Limpar timeouts ao desmontar
    useEffect(() => {
        return () => {
            if (loadGuestsTimeoutRef.current) {
                clearTimeout(loadGuestsTimeoutRef.current);
            }
            if (statisticsTimeoutRef.current) {
                clearTimeout(statisticsTimeoutRef.current);
            }
        };
    }, []);

    const loadGuests = useCallback(async (params?: any) => {
        // Cancela chamada anterior se existir
        if (loadGuestsTimeoutRef.current) {
            clearTimeout(loadGuestsTimeoutRef.current);
        }

        // Agenda nova chamada com delay de 300ms
        loadGuestsTimeoutRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await guestsService.getAll(params);
                setGuests(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar convidados');
                toast.error('Erro ao carregar convidados');
            } finally {
                setLoading(false);
            }
        }, 300);
    }, []);

    const loadStatistics = useCallback(async () => {
        // Cancela chamada anterior se existir
        if (statisticsTimeoutRef.current) {
            clearTimeout(statisticsTimeoutRef.current);
        }

        // Agenda nova chamada com delay de 300ms
        statisticsTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await guestsService.getStatistics();
                setStatistics(response.data);
            } catch (err) {
                console.error('Erro ao carregar estatísticas:', err);
            }
        }, 300);
    }, []);

    const createGuest = async (data: CreateGuestDto) => {
        try {
            const response = await guestsService.create(data);
            toast.success('Convidado criado com sucesso!');
            await loadGuests();
            await loadStatistics();
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar convidado';
            toast.error(errorMessage);
            throw err;
        }
    };

    const updateGuest = async (id: string, data: UpdateGuestDto) => {
        try {
            const response = await guestsService.update(id, data);
            toast.success('Convidado atualizado com sucesso!');
            await loadGuests();
            await loadStatistics();
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar convidado';
            toast.error(errorMessage);
            throw err;
        }
    };

    const deleteGuest = async (id: string) => {
        try {
            await guestsService.delete(id);
            toast.success('Convidado removido com sucesso!');
            await loadGuests();
            await loadStatistics();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao remover convidado';
            toast.error(errorMessage);
            throw err;
        }
    };

    const refreshGuests = useCallback(async () => {
        // Força atualização ignorando o timer
        setLoading(true);
        setError(null);
        try {
            const response = await guestsService.getAll();
            setGuests(response.data);
            const statsResponse = await guestsService.getStatistics();
            setStatistics(statsResponse.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar dados');
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGuests();
        loadStatistics();
    }, [loadGuests, loadStatistics]);

    return {
        guests,
        statistics,
        loading,
        error,
        loadGuests,
        loadStatistics,
        createGuest,
        updateGuest,
        deleteGuest,
        refreshGuests,
    };
};