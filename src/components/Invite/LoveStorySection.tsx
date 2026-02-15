// src/components/Invite/LoveStorySection.tsx
import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

const LoveStorySection: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <HeartIcon className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-4">
                        Nossa História
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8">
                        {/* Timeline item 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gold">2018</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    O Primeiro Encontro
                                </h3>
                                <p className="text-gray-600">
                                    Nos conhecemos na faculdade, durante uma aula de fotografia.
                                    João estava fotografando o pôr do sol e eu, Ana, passei na frente
                                    sem querer. O resto é história!
                                </p>
                            </div>
                        </div>

                        {/* Timeline item 2 */}
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gold">2022</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    O Pedido
                                </h3>
                                <p className="text-gray-600">
                                    No mesmo lugar onde nos conhecemos, João preparou um piquenique
                                    ao pôr do sol e pediu minha mão em casamento. Foi perfeito!
                                </p>
                            </div>
                        </div>

                        {/* Timeline item 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gold">2024</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    O Grande Dia
                                </h3>
                                <p className="text-gray-600">
                                    Agora queremos celebrar esse amor com as pessoas mais especiais
                                    das nossas vidas: VOCÊS! Preparem-se para uma festa inesquecível.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStorySection;