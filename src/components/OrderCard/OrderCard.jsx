import { Utensils, Clock, ChevronRight, Loader2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import { formatarMoeda, formatarTempoRelativo } from '../../utils/format';
import { proximaAcaoGarcom } from '../../utils/pedidoStatus';
import './OrderCard.css';

/**
 * Cartão de um pedido na listagem (shape PedidoResumoResponse).
 *
 * @param {object}   pedido       - { id, numeroMesa, nomeGarcom, status, total, criadoEm }
 * @param {function} onSelecionar - chamado ao tocar no card (abre o detalhe)
 * @param {function} onAvancar    - (pedido, proximoStatus) → avança o status pela ação rápida
 * @param {boolean}  acaoCarregando - trava o botão de ação enquanto a chamada roda
 */
function OrderCard({ pedido, onSelecionar, onAvancar, acaoCarregando = false }) {
    const acao = proximaAcaoGarcom(pedido.status);

    function handleAcao(event) {
        event.stopPropagation(); // não abre o detalhe ao clicar no botão de ação
        onAvancar?.(pedido, acao.proximoStatus);
    }

    return (
        <article
            className="order-card"
            onClick={() => onSelecionar?.(pedido)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelecionar?.(pedido)}
        >
            <div className="order-card__top">
                <span className="order-card__mesa">
                    <Utensils size={16} strokeWidth={2} />
                    Mesa {pedido.numeroMesa}
                </span>
                <StatusBadge status={pedido.status} />
            </div>

            <div className="order-card__mid">
                <span className="order-card__total">{formatarMoeda(pedido.total)}</span>
                <span className="order-card__time">
                    <Clock size={13} strokeWidth={2} />
                    {formatarTempoRelativo(pedido.criadoEm)}
                </span>
            </div>

            {acao ? (
                <button
                    className="order-card__acao"
                    onClick={handleAcao}
                    disabled={acaoCarregando}
                >
                    {acaoCarregando ? (
                        <Loader2 size={16} className="order-card__spinner" />
                    ) : (
                        acao.label
                    )}
                </button>
            ) : (
                <div className="order-card__ver">
                    Ver detalhes <ChevronRight size={16} strokeWidth={2} />
                </div>
            )}
        </article>
    );
}

export default OrderCard;
