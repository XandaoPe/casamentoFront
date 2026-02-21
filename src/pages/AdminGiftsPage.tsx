import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import {
    GiftIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ArrowLeftIcon,
    XMarkIcon,
    PhotoIcon,
    UserGroupIcon,
    ChatBubbleLeftEllipsisIcon,
    ChartPieIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    ChevronDownIcon,
    CheckBadgeIcon,
    BanknotesIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AddGiftModal from '../components/Admin/AddGiftModal';

const AdminGiftsPage: React.FC = () => {
    const navigate = useNavigate();
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState<any>(null);
    const [viewingGift, setViewingGift] = useState<any>(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const [showBuyersModal, setShowBuyersModal] = useState(false);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loadingReservations, setLoadingReservations] = useState(false);

    const loadGifts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gifts/admin');
            setGifts(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar presentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadGifts(); }, []);

    // --- LÓGICA DO DASHBOARD ATUALIZADA ---
    const stats = useMemo(() => {
        if (gifts.length === 0) return {
            totalArrecadado: 0,
            metaTotal: 0,
            valorTotalCotas: 0,
            valorRestanteCotas: 0,
            presentesFinalizados: 0,
            totalCotasVendidas: 0,
            progresso: 0
        };

        let totalArrecadado = 0;
        let metaTotal = 0;
        let valorTotalCotas = 0;
        let presentesFinalizados = 0;
        let totalCotasVendidas = 0;

        gifts.forEach(gift => {
            const total = gift.valorTotal || 0;
            const vendidas = gift.cotasVendidas || 0;
            const totalDeCotas = gift.totalCotas || 1;
            const valorCota = total / totalDeCotas;

            // 1. Acumula Meta Total Geral
            metaTotal += total;

            // 2. Acumula Total Arrecadado (Baseado nas cotas pagas)
            totalArrecadado += (valorCota * vendidas);

            // 3. Valor Total apenas de presentes que possuem cotas (totalCotas > 1)
            if (totalDeCotas > 1) {
                valorTotalCotas += total;
            }

            // 4. Contagem de Finalizados
            if (vendidas >= totalDeCotas) {
                presentesFinalizados++;
            }

            // 5. Total de cotas vendidas (volume)
            totalCotasVendidas += vendidas;
        });

        const valorRestanteCotas = metaTotal - totalArrecadado;
        const progresso = metaTotal > 0 ? (totalArrecadado / metaTotal) * 100 : 0;

        return {
            totalArrecadado,
            metaTotal,
            valorTotalCotas,
            valorRestanteCotas,
            presentesFinalizados,
            totalCotasVendidas,
            progresso
        };
    }, [gifts]);

    const handleEditClick = (gift: any) => {
        setSelectedGift(gift);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este presente?')) return;
        try {
            await api.delete(`/gifts/admin/${id}`);
            toast.success('Excluído com sucesso');
            loadGifts();
        } catch (error) {
            toast.error('Erro ao excluir');
        }
    };

    const handleShowBuyers = async (gift: any) => {
        try {
            setSelectedGift(gift);
            setShowBuyersModal(true);
            setLoadingReservations(true);
            const response = await api.get(`/gifts/${gift._id}/reservations`);
            setReservations(response.data);
        } catch (error) {
            toast.error('Erro ao carregar lista de convidados');
        } finally {
            setLoadingReservations(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <GiftIcon className="h-8 w-8 text-rose-600" />
                                Gestão de Presentes
                            </h1>
                            <p className="text-gray-500 text-sm">Controle financeiro e de cotas</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setSelectedGift(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Novo Presente
                    </button>
                </div>

                {/* --- SEÇÃO DASHBOARD ATUALIZADA COM NOVOS CARDS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

                    {/* Card 1: Valor Total das Cotas */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <BanknotesIcon className="h-4 w-4 text-blue-500" />
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Total em Cotas</p>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">
                            R$ {stats.valorTotalCotas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Soma de itens fracionados</p>
                    </div>

                    {/* Card 2: Valor Arrecadado (Já existia) */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Valor Recebido</p>
                        <h3 className="text-xl font-black text-gray-900">
                            R$ {stats.totalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter italic">Dinheiro em caixa</p>
                    </div>

                    {/* Card 3: Valor Restante (Faltantes) */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <ClockIcon className="h-4 w-4 text-rose-500" />
                            <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Restante</p>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">
                            R$ {stats.valorRestanteCotas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter italic">Aguardando presente</p>
                    </div>

                    {/* Card 4: Cotas Recebidas (Volume) */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Participações</p>
                        <h3 className="text-xl font-black text-gray-900">{stats.totalCotasVendidas}</h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter italic">Cotas totais vendidas</p>
                    </div>

                    {/* Card 5: % de Conclusão */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Progresso Meta</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900">{stats.progresso.toFixed(1)}%</h3>
                            <ArrowTrendingUpIcon className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.progresso}%` }} />
                        </div>
                    </div>
                </div>

                {/* --- ACCORDION DE DETALHE POR COTA --- */}
                <div className="mb-10 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <button
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ChartPieIcon className="h-6 w-6 text-blue-500" />
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">Detalhamento por Itens</h3>
                                <p className="text-xs text-gray-400">Acompanhe o preenchimento de cada presente</p>
                            </div>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isAccordionOpen && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50 max-h-96 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {gifts.map(gift => (
                                    <div key={gift._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="h-12 w-12 rounded-xl bg-white flex-shrink-0 border border-gray-100 overflow-hidden">
                                            {gift.imagemUrl ? <img src={gift.imagemUrl} className="h-full w-full object-cover" /> : <PhotoIcon className="h-6 w-6 m-auto text-gray-200 mt-3" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-xs font-bold text-gray-700 truncate pr-2">{gift.nome}</p>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${gift.cotasVendidas >= gift.totalCotas ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {gift.cotasVendidas}/{gift.totalCotas}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-700 ${gift.cotasVendidas >= gift.totalCotas ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min((gift.cotasVendidas / gift.totalCotas) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- LISTAGEM DE PRESENTES (GRID) --- */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Todos os Itens ({gifts.length})</h2>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-medium text-gray-400 animate-pulse">Sincronizando presentes...</div>
                ) : gifts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                        <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Nenhum presente cadastrado</h3>
                        <p className="text-gray-500 mb-6">Comece adicionando itens para seus convidados.</p>
                        <button onClick={() => { setSelectedGift(null); setIsModalOpen(true); }} className="text-rose-600 font-bold hover:underline">
                            Cadastrar meu primeiro presente
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gifts.map((gift: any) => (
                            <div key={gift._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                <div className="relative h-48 bg-gray-100">
                                    {gift.imagemUrl ? (
                                        <img src={gift.imagemUrl} alt={gift.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <PhotoIcon className="h-12 w-12" />
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setViewingGift(gift)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-blue-600 transition-colors"><EyeIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleEditClick(gift)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-amber-600 transition-colors"><PencilIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(gift._id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-red-600 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                                    </div>

                                    {gift.cotasVendidas >= gift.totalCotas && (
                                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                                            <CheckBadgeIcon className="h-3 w-3" /> Concluído
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{gift.nome}</h3>
                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-rose-600 font-black text-lg leading-none">
                                                R$ {gift.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mt-1">
                                                {gift.cotasVendidas} de {gift.totalCotas} cotas vendidas
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleShowBuyers(gift)}
                                            className="bg-gray-50 text-gray-600 px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-gray-100 flex items-center gap-2"
                                        >
                                            <UserGroupIcon className="h-4 w-4" />
                                            <span className="text-xs font-bold">Ver Nomes</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAL DE COMPRADORES --- */}
            {showBuyersModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Histórico de Carinho</h3>
                                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">{selectedGift?.nome}</p>
                            </div>
                            <button onClick={() => setShowBuyersModal(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-all">
                                <XMarkIcon className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
                            {loadingReservations ? (
                                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>
                            ) : reservations.length === 0 ? (
                                <div className="text-center py-12">
                                    <UserGroupIcon className="h-12 w-12 text-gray-200 mx-auto mb-2" />
                                    <p className="text-gray-500 font-medium">Ainda sem contribuições.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reservations.map((res: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="block font-black text-gray-800 text-lg">{res.nomeConvidado}</span>
                                                    <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-rose-600 font-black">R$ {res.valorPago.toLocaleString('pt-BR')}</span>
                                                    <span className="text-[9px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase">
                                                        {res.quantidadeCotas} {res.quantidadeCotas > 1 ? 'cotas' : 'cota'}
                                                    </span>
                                                </div>
                                            </div>
                                            {res.mensagem && (
                                                <div className="flex gap-2 text-sm text-gray-600 italic bg-white p-3 rounded-2xl border border-gray-100">
                                                    <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-rose-300 shrink-0" />
                                                    <p>"{res.mensagem}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50/50">
                            <button onClick={() => setShowBuyersModal(false)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all">Fechar Lista</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE VISUALIZAÇÃO RÁPIDA */}
            {viewingGift && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="relative h-64">
                            <img src={viewingGift.imagemUrl || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setViewingGift(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-8 text-center">
                            <h3 className="text-2xl font-black text-gray-900 mb-2">{viewingGift.nome}</h3>
                            <p className="text-gray-500 mb-6 px-4 leading-relaxed">{viewingGift.descricao || 'Sem descrição cadastrada.'}</p>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</p>
                                    <p className="font-black text-gray-900 leading-none">R$ {viewingGift.valorTotal.toLocaleString('pt-BR')}</p>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                    <p className="font-black text-rose-600 leading-none">{viewingGift.cotasVendidas}/{viewingGift.totalCotas}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingGift(null)} className="w-full mt-6 bg-gray-900 text-white py-4 rounded-2xl font-bold">Fechar Visualização</button>
                        </div>
                    </div>
                </div>
            )}

            <AddGiftModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedGift(null); }}
                onSuccess={loadGifts}
                gift={selectedGift}
            />
        </div>
    );
};

export default AdminGiftsPage;