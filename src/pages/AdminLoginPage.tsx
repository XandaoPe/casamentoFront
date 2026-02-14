// src/pages/AdminLoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        const success = await signIn(username, password);

        if (success) {
            navigate('/admin/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card de Login */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="bg-gold py-6 px-8 text-center">
                        <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
                        <p className="text-white/80 text-sm mt-1">Acesse para gerenciar os convidados</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Usuário
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="Digite seu usuário"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="Digite sua senha"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner size="small" color="white" />
                                    <span className="ml-2">Entrando...</span>
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Rodapé */}
                    <div className="bg-gray-50 px-6 py-4 text-center">
                        <p className="text-xs text-gray-500">
                            Acesso restrito apenas para administradores
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;