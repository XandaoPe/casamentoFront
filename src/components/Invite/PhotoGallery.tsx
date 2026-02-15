// src/components/Invite/PhotoGallery.tsx
import React, { useState } from 'react';
import { CameraIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PhotoGalleryProps {
    photos: Array<{
        url: string;
        caption?: string;
    }>;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

    const handlePrevious = () => {
        if (selectedPhoto !== null && selectedPhoto > 0) {
            setSelectedPhoto(selectedPhoto - 1);
        }
    };

    const handleNext = () => {
        if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
            setSelectedPhoto(selectedPhoto + 1);
        }
    };

    return (
        <section className="py-16 bg-rose-50">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <CameraIcon className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h2 className="font-script text-3xl md:text-4xl text-gray-800 mb-4">
                        Momentos Especiais
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </div>

                {/* Grid de fotos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => setSelectedPhoto(index)}
                        >
                            <img
                                src={photo.url}
                                alt={photo.caption || `Foto ${index + 1}`}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-sm">Ampliar</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de visualização */}
                {selectedPhoto !== null && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300"
                        >
                            <XMarkIcon className="h-8 w-8" />
                        </button>

                        {selectedPhoto > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 text-white hover:text-gray-300"
                            >
                                <ChevronLeftIcon className="h-8 w-8" />
                            </button>
                        )}

                        {selectedPhoto < photos.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-4 text-white hover:text-gray-300"
                            >
                                <ChevronRightIcon className="h-8 w-8" />
                            </button>
                        )}

                        <img
                            src={photos[selectedPhoto].url}
                            alt={photos[selectedPhoto].caption || `Foto ${selectedPhoto + 1}`}
                            className="max-h-[90vh] max-w-full object-contain"
                        />

                        {photos[selectedPhoto].caption && (
                            <p className="absolute bottom-4 left-0 right-0 text-center text-white">
                                {photos[selectedPhoto].caption}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PhotoGallery;