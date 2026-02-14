// src/services/guests.service.ts
import api from './api';
import {
    Guest,
    CreateGuestDto,
    UpdateGuestDto,
    GuestStatistics,
    ConfirmPresenceDto
} from '../types/guest.types';

export const guestsService = {
    // Rotas públicas
    getByToken: (token: string) =>
        api.get<Guest>(`/guests/invite/${token}`),

    confirmPresence: (token: string, data: ConfirmPresenceDto) =>
        api.post(`/guests/confirm/${token}`, data),

    // Rotas administrativas
    getAll: (params?: { grupo?: string; confirmado?: boolean }) =>
        api.get<Guest[]>('/guests/admin', { params }),

    getById: (id: string) =>
        api.get<Guest>(`/guests/admin/${id}`),

    create: (data: CreateGuestDto) =>
        api.post<Guest>('/guests/admin', data),

    update: (id: string, data: UpdateGuestDto) =>
        api.put<Guest>(`/guests/admin/${id}`, data),

    delete: (id: string) =>
        api.delete(`/guests/admin/${id}`),

    getStatistics: () =>
        api.get<GuestStatistics>('/guests/admin/statistics'),
};