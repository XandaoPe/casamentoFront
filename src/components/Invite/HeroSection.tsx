// src/components/Invite/HeroSection.tsx
import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

interface HeroSectionProps {
    nomeConvidado: string;
    dataEvento: string;
    fotos?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ nomeConvidado, dataEvento }) => {
    return (
        <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/images/casamento-hero.jpg")',
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Conteúdo */}
            <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
                {/* Ícone decorativo */}
                <HeartIcon className="w-16 h-16 text-gold mb-6 animate-pulse" />

                {/* Título */}
                <h1 className="font-script text-5xl md:text-7xl text-center mb-4">
                    John John  &  Isa
                </h1>

                {/* Data */}
                <p className="text-xl md:text-2xl mb-8 tracking-widest">
                    21 · NOVEMBRO · 2026
                </p>

                {/* Mensagem personalizada */}
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
                    <p className="text-lg md:text-xl">
                        <span className="font-light">Querido(a)</span>
                        <span className="font-bold ml-2 text-black">{nomeConvidado}</span>
                    </p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;