/**
 * Barramento de notificações do MOCK.
 *
 * Substitui o WebSocket quando VITE_USE_MOCK=true: em vez de receber mensagens
 * do servidor, o próprio front emite/escuta eventos localmente. O payload tem
 * exatamente o mesmo shape que o back envia em /topic/pedidos/{funcionarioId}:
 *   { pedidoId, numeroMesa, novoStatus, mensagem }
 */

const ouvintes = new Set();

/** Inscreve um callback para receber notificações. Retorna a função de cancelamento. */
export function assinarNotificacoes(callback) {
    ouvintes.add(callback);
    return () => ouvintes.delete(callback);
}

/** Emite uma notificação para todos os inscritos. */
export function emitirNotificacao(payload) {
    for (const ouvinte of ouvintes) {
        try {
            ouvinte(payload);
        } catch {
            /* um ouvinte com erro não deve travar os demais */
        }
    }
}

/**
 * Monta a mensagem amigável — espelha o montarMensagem() do
 * NotificacaoPedidoService do back-end.
 */
export function montarMensagem(numeroMesa, status) {
    switch (status) {
        case 'EM_PREPARO': return `🍳 Mesa ${numeroMesa} — pedido em preparo`;
        case 'PRONTO':     return `✅ Mesa ${numeroMesa} — pedido pronto para entrega!`;
        case 'ENTREGUE':   return `🎉 Mesa ${numeroMesa} — pedido entregue`;
        case 'CANCELADO':  return `❌ Mesa ${numeroMesa} — pedido cancelado`;
        default:           return `Mesa ${numeroMesa} — status: ${status}`;
    }
}
