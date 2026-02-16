// src/types/invite.types.ts
export interface Acompanhante {
    nome: string;
    idade?: number;
    restricaoAlimentar?: string[];
}

export interface PresenteCota {
    _id: string;
    id: string;
    nome: string;
    descricao: string;
    imagem: string;
    valorTotal: number;
    valorCota: number;
    cotasDisponiveis: number;
    cotasCompradas: number;
    loja?: string;
    linkExterno?: string;
}

export interface CardapioItem {
    id: string;
    nome: string;
    descricao: string;
    tipo: 'entrada' | 'principal' | 'sobremesa' | 'bebida';
    imagem?: string;
    restricoes?: string[];
}

export interface ConfirmacaoEstendida {
    confirmado: boolean;
    numAcompanhantes: number;
    acompanhantes?: Acompanhante[];
    presente?: {
        presenteId: string;
        nome: string;
        valor: number;
        quantidade: number;
    };
    mensagem?: string;
    escolhasCardapio?: {
        principal?: string;
        sobremesa?: string;
        bebida?: string;
    };
}