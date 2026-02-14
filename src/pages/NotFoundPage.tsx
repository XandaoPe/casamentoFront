// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <ExclamationTriangleIcon className="h-20 w-20 text-gold mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
                    <p className="text-gray-600 mb-6">
                        A página que você está procurando não existe ou foi removida.
                    </p>
                    <Link to="/" className="btn-primary inline-block">
                        Voltar para o início
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;