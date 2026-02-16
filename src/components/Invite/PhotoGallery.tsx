// src/components/Invite/PhotoGallery.tsx
import React, { useState, useEffect } from 'react';
import { CameraIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PhotoGalleryProps {
    photos: Array<{ url: string; caption?: string; }>;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

    // Bloquear scroll quando modal aberto
    useEffect(() => {
        if (selectedPhoto !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedPhoto]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhoto !== null) {
            setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhoto !== null) {
            setSelectedPhoto(selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1);
        }
    };

    return (
        <section className="py-16 bg-rose-50/30">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <CameraIcon className="h-10 w-10 text-gold mx-auto mb-3" />
                    <h2 className="font-script text-4xl text-gray-800 mb-4">Nossa História</h2>
                    <div className="w-16 h-1 bg-gold mx-auto" />
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
                            onClick={() => setSelectedPhoto(index)}
                        >
                            <img
                                src={photo.url}
                                alt={photo.caption || 'Foto'}
                                className="w-full object-cover hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Lightbox - Full Screen Mobile */}
                {selectedPhoto !== null && (
                    <div
                        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 sm:p-10"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button className="absolute top-6 right-6 text-white p-2 z-[210]">
                            <XMarkIcon className="h-8 w-8" />
                        </button>

                        <button onClick={handlePrev} className="absolute left-4 p-2 text-white/50 hover:text-white hidden sm:block">
                            <ChevronLeftIcon className="h-12 w-12" />
                        </button>

                        <div className="relative max-w-5xl max-h-full flex flex-col items-center">
                            <img
                                src={photos[selectedPhoto].url}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                alt="Visualização"
                            />
                            {photos[selectedPhoto].caption && (
                                <p className="text-white mt-6 text-center font-medium px-4">
                                    {photos[selectedPhoto].caption}
                                </p>
                            )}

                            {/* Navegação Mobile Inferior */}
                            <div className="flex sm:hidden gap-10 mt-8">
                                <button onClick={handlePrev} className="p-4 bg-white/10 rounded-full text-white"><ChevronLeftIcon className="h-8 w-8" /></button>
                                <button onClick={handleNext} className="p-4 bg-white/10 rounded-full text-white"><ChevronRightIcon className="h-8 w-8" /></button>
                            </div>
                        </div>

                        <button onClick={handleNext} className="absolute right-4 p-2 text-white/50 hover:text-white hidden sm:block">
                            <ChevronRightIcon className="h-12 w-12" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PhotoGallery;