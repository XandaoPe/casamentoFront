// src/services/invitations.service.ts
import { BulkInvitationResult, WhatsAppInvitation } from '../types/invitation.types';
import api from './api';

export const invitationsService = {
    sendEmail: (guestId: string) =>
        api.post<{ message: string; guestId: string; email: string }>(
            `/invitations/email/${guestId}`
        ),

    sendSms: (guestId: string) =>
        api.post<{ message: string; guestId: string; telefone: string }>(
            `/invitations/sms/${guestId}`
        ),

    getWhatsAppLink: (guestId: string) =>
        api.get<WhatsAppInvitation>(`/invitations/whatsapp/${guestId}`),

    sendBulk: (guestIds: string[], method: 'email' | 'sms') =>
        api.post<BulkInvitationResult>('/invitations/bulk', { guestIds, method }),
};