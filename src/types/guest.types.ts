// src/types/guest.types.ts
export interface Guest {
    _id: string;
    nome: string;
    email: string;
    telefone: string;
    tokenUnico: string;
    confirmado: boolean;
    confirmadoEm?: Date;
    numAcompanhantes: number;
    maxAcompanhantes: number;
    grupo: string;
    observacoes?: string;
    conviteEnviado: boolean;
    dataEnvioConvite?: Date;
    dataVisualizacao?: Date;
    vezesVisualizado: number;
    presente?: {
        nome: string;
        valor: number;
        confirmado: boolean;
    };
    restricaoAlimentar?: string[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        visualizacoes?: number;
        ipConfirmacao?: string;
        userAgent?: string;
        ultimoAcesso?: Date;
    };
}

export interface CreateGuestDto {
    nome: string;
    email: string;
    telefone: string;
    grupo: string;
    maxAcompanhantes: number;
    observacoes?: string;
    restricaoAlimentar?: string[];
}

export interface UpdateGuestDto extends Partial<CreateGuestDto> {
    confirmado?: boolean;
    numAcompanhantes?: number;
    conviteEnviado?: boolean;
    dataEnvioConvite?: Date;
    presente?: {
        nome: string;
        valor: number;
        confirmado: boolean;
    };
}

export interface ConfirmPresenceDto {
    confirmado: boolean;
    numAcompanhantes: number;
    mensagem?: string;
    restricaoAlimentar?: string[];
}

export interface GuestStatistics {
    total: number;
    confirmados: number;
    totalPessoas: number;
    taxaConfirmacao: number;
    totalPresentes: number;
    valorTotalPresentes: number;
    porGrupo: Array<{
        _id: string;
        total: number;
        confirmados: number;
        totalPessoas: number;
    }>;
    porDia: Array<{
        data: string;
        confirmados: number;
    }>;
}