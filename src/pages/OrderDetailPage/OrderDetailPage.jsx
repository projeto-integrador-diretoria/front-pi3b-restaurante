import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Utensils, User, Clock, Loader2, AlertCircle } from 'lucide-react';
import { usePageHeader } from '../../context/PageHeaderContext';
import { useNotificacoes } from '../../context/NotificacoesContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Button from '../../components/Button/Button';
import {
    buscarPedido,
    atualizarStatusPedido,
    cancelarPedido,
} from '../../services/pedidoService';
import { formatarMoeda, formatarDataHora } from '../../utils/format';
import { proximaAcaoGarcom, podeCancelar } from '../../utils/pedidoStatus';
import './OrderDetailPage.css';

function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeader } = usePageHeader();
    const { ultima } = useNotificacoes();

    const [pedido, setPedido] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [acaoCarregando, setAcaoCarregando] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            setPedido(await buscarPedido(id));
        } catch (err) {
            console.error(err);
            setErro('Pedido não encontrado.');
        } finally {
            setCarregando(false);
        }
    }, [id]);

    useEffect(() => {
        // Carrega ao montar; o setState ocorre dentro de carregar(), após o await.
        (async () => { await carregar(); })();
    }, [carregar]);

    useEffect(() => {
        // Recarrega este pedido quando chega uma notificação referente a ele.
        if (ultima?.pedidoId !== id) return;
        (async () => { await carregar(); })();
    }, [ultima, id, carregar]);

    useEffect(() => {
        setHeader({
            title: 'Detalhe do pedido',
            subtitle: pedido ? `Mesa ${pedido.numeroMesa}` : null,
            showBack: true,
        });
    }, [setHeader, pedido]);

    async function handleAvancar(proximoStatus) {
        setAcaoCarregando(true);
        try {
            await atualizarStatusPedido(id, proximoStatus);
            await carregar();
        } catch (err) {
            console.error(err);
            alert('Não foi possível atualizar o status.');
        } finally {
            setAcaoCarregando(false);
        }
    }

    async function handleCancelar() {
        if (!window.confirm('Cancelar este pedido? Essa ação não pode ser desfeita.')) return;
        setAcaoCarregando(true);
        try {
            await cancelarPedido(id);
            await carregar();
        } catch (err) {
            console.error(err);
            alert('Não foi possível cancelar o pedido.');
        } finally {
            setAcaoCarregando(false);
        }
    }

    if (carregando) {
        return (
            <div className="pedido-detalhe__estado">
                <Loader2 size={28} className="pedido-detalhe__spin" />
                <p>Carregando…</p>
            </div>
        );
    }

    if (erro || !pedido) {
        return (
            <div className="pedido-detalhe__estado">
                <AlertCircle size={40} color="#dc2626" />
                <p>{erro || 'Pedido não encontrado.'}</p>
                <Button variant="outline" onClick={() => navigate('/home')}>Voltar aos pedidos</Button>
            </div>
        );
    }

    const acao = proximaAcaoGarcom(pedido.status);

    return (
        <div className="pedido-detalhe">
            {/* Cabeçalho: status + metadados */}
            <div className="pedido-detalhe__topo">
                <StatusBadge status={pedido.status} />
                <span className="pedido-detalhe__total">{formatarMoeda(pedido.total)}</span>
            </div>

            <div className="pedido-detalhe__meta">
                <span className="pedido-detalhe__meta-item">
                    <Utensils size={15} /> Mesa {pedido.numeroMesa}
                </span>
                <span className="pedido-detalhe__meta-item">
                    <User size={15} /> {pedido.nomeGarcom}
                </span>
                <span className="pedido-detalhe__meta-item">
                    <Clock size={15} /> {formatarDataHora(pedido.criadoEm)}
                </span>
            </div>

            {/* Itens */}
            <h2 className="pedido-detalhe__secao">Itens</h2>
            <div className="pedido-detalhe__itens">
                {pedido.itens?.map((item) => (
                    <div key={item.id} className="pedido-detalhe__item">
                        <span className="pedido-detalhe__item-qtd">{item.quantidade}×</span>
                        <div className="pedido-detalhe__item-desc">
                            <span className="pedido-detalhe__item-nome">{item.nomeItem}</span>
                            <span className="pedido-detalhe__item-unit">{formatarMoeda(item.precoUnitario)} un.</span>
                            {item.personalizacoes?.trim() && (
                                <span className="pedido-detalhe__item-obs">{item.personalizacoes}</span>
                            )}
                        </div>
                        <span className="pedido-detalhe__item-sub">{formatarMoeda(item.subtotal)}</span>
                    </div>
                ))}
            </div>

            <div className="pedido-detalhe__total-linha">
                <span>Total</span>
                <strong>{formatarMoeda(pedido.total)}</strong>
            </div>

            {/* Ações do garçom */}
            {(acao || podeCancelar(pedido.status)) && (
                <div className="pedido-detalhe__acoes">
                    {acao && (
                        <Button fullWidth loading={acaoCarregando} onClick={() => handleAvancar(acao.proximoStatus)}>
                            {acao.label}
                        </Button>
                    )}
                    {podeCancelar(pedido.status) && (
                        <Button
                            fullWidth
                            variant="danger"
                            disabled={acaoCarregando}
                            onClick={handleCancelar}
                        >
                            Cancelar pedido
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default OrderDetailPage;
