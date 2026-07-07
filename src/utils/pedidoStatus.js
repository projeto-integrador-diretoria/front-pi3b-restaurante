/**
 * Metadados e regras de status do pedido — espelham o back-end.
 *
 * Ciclo de vida (StatusPedido no back):
 *   ABERTO → ENVIADO → EM_PREPARO → PRONTO → ENTREGUE
 *   CANCELADO é terminal (só a partir de ABERTO).
 *
 * Transições que o GARÇOM pode fazer (conforme PedidoService do back):
 *   ABERTO → ENVIADO   (enviar para a cozinha)
 *   PRONTO → ENTREGUE  (confirmar entrega na mesa)
 * As demais transições (EM_PREPARO, PRONTO) são feitas pela cozinha.
 */

export const STATUS_PEDIDO = {
    ABERTO: 'ABERTO',
    ENVIADO: 'ENVIADO',
    EM_PREPARO: 'EM_PREPARO',
    PRONTO: 'PRONTO',
    ENTREGUE: 'ENTREGUE',
    CANCELADO: 'CANCELADO',
};

/**
 * Rótulo e cores de cada status.
 * `cor` é usada no texto/borda e `fundo` no background do badge (tom suave).
 */
export const STATUS_META = {
    ABERTO:     { label: 'Aberto',      cor: '#2563eb', fundo: 'rgba(37, 99, 235, 0.12)' },
    ENVIADO:    { label: 'Enviado',     cor: '#7c3aed', fundo: 'rgba(124, 58, 237, 0.12)' },
    EM_PREPARO: { label: 'Em preparo',  cor: '#d97706', fundo: 'rgba(217, 119, 6, 0.14)' },
    PRONTO:     { label: 'Pronto',      cor: '#16a34a', fundo: 'rgba(22, 163, 74, 0.14)' },
    ENTREGUE:   { label: 'Entregue',    cor: '#6b7280', fundo: 'rgba(107, 114, 128, 0.14)' },
    CANCELADO:  { label: 'Cancelado',   cor: '#dc2626', fundo: 'rgba(220, 38, 38, 0.12)' },
};

const META_PADRAO = { label: '—', cor: '#6b7280', fundo: 'rgba(107, 114, 128, 0.14)' };

export function getStatusMeta(status) {
    return STATUS_META[status] || META_PADRAO;
}

/**
 * Próxima ação de status disponível para o garçom, ou null quando ele
 * não pode avançar o pedido (aguardando a cozinha ou pedido finalizado).
 */
export function proximaAcaoGarcom(status) {
    if (status === STATUS_PEDIDO.ABERTO) {
        return { proximoStatus: STATUS_PEDIDO.ENVIADO, label: 'Enviar para a cozinha' };
    }
    if (status === STATUS_PEDIDO.PRONTO) {
        return { proximoStatus: STATUS_PEDIDO.ENTREGUE, label: 'Marcar como entregue' };
    }
    return null;
}

/** O garçom só pode cancelar enquanto o pedido está ABERTO. */
export function podeCancelar(status) {
    return status === STATUS_PEDIDO.ABERTO;
}

/** Pedidos ENTREGUE e CANCELADO são estados finais (imutáveis). */
export function isFinalizado(status) {
    return status === STATUS_PEDIDO.ENTREGUE || status === STATUS_PEDIDO.CANCELADO;
}
