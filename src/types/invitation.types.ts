// src/types/invitation.types.ts
export interface WhatsAppInvitation {
    guestName: string;
    phone: string;
    inviteLink: string;
    whatsappUrl: string;
    message: string;
}

export interface BulkInvitationResult {
    message: string;
    success: number;
    errors: number;
    errorDetails: Array<{
        guestId: string;
        error: any;
    }>;
}