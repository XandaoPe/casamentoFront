// src/components/Invite/LocationMap.tsx
import React from 'react';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface LocationMapProps {
    ceremony: {
        name: string;
        address: string;
        mapUrl: string;
        time: string;
    };
    party: {
        name: string;
        address: string;
        mapUrl: string;
        time: string;
    };
}

const LocationMap: React.FC<LocationMapProps> = ({ ceremony, party }) => {
    return (
        <section className="py-16 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <MapPinIcon className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-4">
                        Local do Evento
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Cerimônia */}
                    <div className="bg-rose-50 rounded-xl overflow-hidden">
                        <div className="h-48 overflow-hidden relative group">
                            <img
                                src="/images/cerimonia.png"
                                alt="Mapa da Cerimônia"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-full text-gray-600">
                                🗺️ Clique para ampliar
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                🕍 {ceremony.name}
                            </h3>
                            <div className="space-y-2 text-gray-600 mb-4">
                                <p className="flex items-start gap-2">
                                    <MapPinIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                                    <span>{ceremony.address}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <ClockIcon className="h-5 w-5 text-gold" />
                                    <span>{ceremony.time}</span>
                                </p>
                            </div>
                            <a
                                href={ceremony.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full text-center bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                            >
                                Ver no Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Recepção */}
                    <div className="bg-rose-50 rounded-xl overflow-hidden">
                        <div className="h-48 overflow-hidden relative group">
                            <img
                                src="/images/mapaRecepcao.png"
                                alt="Mapa da Recepção"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-full text-gray-600">
                                🗺️ Clique para ampliar
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                🎉 {party.name}
                            </h3>
                            <div className="space-y-2 text-gray-600 mb-4">
                                <p className="flex items-start gap-2">
                                    <MapPinIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                                    <span>{party.address}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <ClockIcon className="h-5 w-5 text-gold" />
                                    <span>{party.time}</span>
                                </p>
                            </div>
                            <a
                                href={party.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full text-center bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                            >
                                Ver no Google Maps
                            </a>
                        </div>
                    </div>
                </div>

                {/* Dress Code */}
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-800 mb-2">💃 Dress Code</h4>
                    <p className="text-gray-600">
                        Traje social esporte. Cores claras são bem-vindas!
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;