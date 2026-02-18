import { useState } from 'react';
import { invitationsService } from '../services/invitations.service';
import { toast } from 'react-hot-toast';

export const useInvitations = () => {
    const [sending, setSending] = useState(false);

    const sendEmail = async (guestId: string) => {
        setSending(true);
        try {
            const response = await invitationsService.sendEmail(guestId);
            toast.success('Email enviado com sucesso!');
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao enviar email');
            throw err;
        } finally {
            setSending(false);
        }
    };

    const sendSms = async (guestId: string) => {
        setSending(true);
        try {
            const response = await invitationsService.sendSms(guestId);
            toast.success('SMS enviado com sucesso!');
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao enviar SMS');
            throw err;
        } finally {
            setSending(false);
        }
    };

    const sendWhatsApp = async (guestId: string) => {
        setSending(true);
        try {
            const response = await invitationsService.getWhatsAppLink(guestId);

            // Abre a URL do WhatsApp em nova aba
            if (response.data?.whatsappUrl) {
                window.open(response.data.whatsappUrl, '_blank');
                toast.success('Link do WhatsApp gerado!');
            }

            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao gerar WhatsApp');
            throw err;
        } finally {
            setSending(false);
        }
    };

    const sendBulk = async (guestIds: string[], method: 'email' | 'sms') => {
        setSending(true);
        try {
            const response = await invitationsService.sendBulk(guestIds, method);
            toast.success(`${response.data.success} convites processados!`);
            return response.data;
        } catch (err: any) {
            toast.error('Erro no envio em massa');
            throw err;
        } finally {
            setSending(false);
        }
    };

    return { sending, sendEmail, sendSms, sendWhatsApp, sendBulk };
};