import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon, UserIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showWakeUpMessage, setShowWakeUpMessage] = useState<boolean>(false);
    
    const { signIn } = useAuth();
    const navigate = useNavigate();

    // Efeito para mostrar a mensagem de "acordar servidor" após 3 segundos de espera
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => {
                setShowWakeUpMessage(true);
            }, 3000); // Aparece após 3 segundos de loading
        } else {
            setShowWakeUpMessage(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await signIn(username, password);
            if (success) {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="bg-gold py-6 px-8 text-center">
                        <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
                        <p className="text-white/80 text-sm mt-1">Acesse para gerenciar os convidados</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Mensagem de Cold Start do Render */}
                        {showWakeUpMessage && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 animate-pulse">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs text-blue-700 font-medium uppercase leading-tight">
                                            Aguarde que nossos servidores estão processando sua requisição. 
                                            Isso poderá levar até 1 min.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner size="small" color="white" />
                                    <span className="ml-2">Processando...</span>
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

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