// src/components/Invite/MenuSection.tsx
import React, { useState } from 'react';
import { CardapioItem } from '../../types/invite.types';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface MenuSectionProps {
    items: CardapioItem[];
    onSelect?: (item: CardapioItem) => void;
    isSelectable?: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({ items, onSelect, isSelectable = false }) => {
    const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});

    const tipos = {
        entrada: 'Entradas',
        principal: 'Pratos Principais',
        sobremesa: 'Sobremesas',
        bebida: 'Bebidas'
    };

    const handleSelect = (item: CardapioItem) => {
        if (!isSelectable) return;

        setSelectedItems(prev => ({
            ...prev,
            [item.tipo]: item.id
        }));

        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-rose-50">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <SparklesIcon className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-4">
                        Nosso Cardápio
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </div>

                {(Object.keys(tipos) as Array<keyof typeof tipos>).map((tipo) => {
                    const itensDoTipo = items.filter(item => item.tipo === tipo);

                    if (itensDoTipo.length === 0) return null;

                    return (
                        <div key={tipo} className="mb-12 last:mb-0">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                                {tipos[tipo]}
                            </h3>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {itensDoTipo.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`
                                            bg-white rounded-xl shadow-sm overflow-hidden
                                            ${isSelectable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
                                            ${selectedItems[tipo] === item.id ? 'ring-2 ring-gold' : ''}
                                        `}
                                    >
                                        {item.imagem && (
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={item.imagem}
                                                    alt={item.nome}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                {item.nome}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {item.descricao}
                                            </p>
                                            {item.restricoes && item.restricoes.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.restricoes.map((r, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                                                        >
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MenuSection;