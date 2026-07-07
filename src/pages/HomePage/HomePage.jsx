import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Plus, ClipboardList, AlertCircle } from 'lucide-react';
import { usePageHeader } from '../../context/PageHeaderContext';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/OrderCard/OrderCard';
import Button from '../../components/Button/Button';
import { listarMeusPedidos, atualizarStatusPedido } from '../../services/pedidoService';
import { isFinalizado } from '../../utils/pedidoStatus';
import './HomePage.css';

const FILTROS = [
    { chave: 'ativos', label: 'Ativos' },
    { chave: 'todos', label: 'Todos' },
];

function HomePage() {
    const { setHeader } = usePageHeader();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [filtro, setFiltro] = useState('ativos');
    const [acaoId, setAcaoId] = useState(null); // id do pedido cuja ação rápida está rodando

    const primeiroNome = (user?.nome || user?.username || '').split(' ')[0];

    useEffect(() => {
        setHeader({
            title: 'Pedidos',
            subtitle: primeiroNome ? `Olá, ${primeiroNome}` : 'Seus pedidos',
        });
    }, [setHeader, primeiroNome]);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            const dados = await listarMeusPedidos();
            setPedidos(dados);
        } catch (err) {
            console.error(err);
            setErro('Não foi possível carregar os pedidos.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        // Carrega ao montar; o setState ocorre dentro de carregar(), após o await.
        (async () => { await carregar(); })();
    }, [carregar]);

    const pedidosFiltrados = useMemo(() => {
        if (filtro === 'todos') return pedidos;
        return pedidos.filter((p) => !isFinalizado(p.status));
    }, [pedidos, filtro]);

    async function handleAvancar(pedido, proximoStatus) {
        setAcaoId(pedido.id);
        try {
            await atualizarStatusPedido(pedido.id, proximoStatus);
            await carregar();
        } catch (err) {
            console.error(err);
            alert('Não foi possível atualizar o status do pedido.');
        } finally {
            setAcaoId(null);
        }
    }

    return (
        <div className="pedidos-page">
            <div className="pedidos-page__toolbar">
                <div className="pedidos-filtro" role="tablist">
                    {FILTROS.map(({ chave, label }) => (
                        <button
                            key={chave}
                            role="tab"
                            aria-selected={filtro === chave}
                            className={`pedidos-filtro__btn${filtro === chave ? ' pedidos-filtro__btn--ativo' : ''}`}
                            onClick={() => setFiltro(chave)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <button
                    className="pedidos-page__refresh"
                    onClick={carregar}
                    disabled={carregando}
                    aria-label="Atualizar lista"
                >
                    <RefreshCw size={18} className={carregando ? 'pedidos-page__refresh-icon--girando' : ''} />
                </button>
            </div>

            {/* Estado: carregando */}
            {carregando && pedidos.length === 0 && (
                <div className="pedidos-estado">
                    <RefreshCw size={28} className="pedidos-page__refresh-icon--girando" />
                    <p>Carregando pedidos…</p>
                </div>
            )}

            {/* Estado: erro */}
            {!carregando && erro && (
                <div className="pedidos-estado">
                    <AlertCircle size={40} className="pedidos-estado__icone-erro" />
                    <p>{erro}</p>
                    <Button variant="outline" onClick={carregar}>Tentar novamente</Button>
                </div>
            )}

            {/* Estado: vazio */}
            {!carregando && !erro && pedidosFiltrados.length === 0 && (
                <div className="pedidos-estado">
                    <ClipboardList size={44} className="pedidos-estado__icone" />
                    <p className="pedidos-estado__titulo">
                        {filtro === 'ativos' ? 'Nenhum pedido ativo' : 'Nenhum pedido ainda'}
                    </p>
                    <p className="pedidos-estado__desc">Toque em “Novo pedido” para começar.</p>
                    <Button onClick={() => navigate('/novo-pedido')}>Novo pedido</Button>
                </div>
            )}

            {/* Lista */}
            {!erro && pedidosFiltrados.length > 0 && (
                <div className="pedidos-lista">
                    {pedidosFiltrados.map((pedido) => (
                        <OrderCard
                            key={pedido.id}
                            pedido={pedido}
                            onSelecionar={(p) => navigate(`/pedidos/${p.id}`)}
                            onAvancar={handleAvancar}
                            acaoCarregando={acaoId === pedido.id}
                        />
                    ))}
                </div>
            )}

            {/* Botão flutuante — novo pedido */}
            <button
                className="pedidos-fab"
                onClick={() => navigate('/novo-pedido')}
                aria-label="Novo pedido"
            >
                <Plus size={24} strokeWidth={2.5} />
            </button>
        </div>
    );
}

export default HomePage;
