/**
 * Store de pedidos do mock — persistido no localStorage.
 *
 * Reproduz a lógica do PedidoService do back-end:
 * - resolve preço/nome de cada item pelo cardápio semente;
 * - calcula subtotal e total (snapshot do preço no momento do pedido);
 * - guarda o nome do garçom logado;
 * - respeita a regra de que só pedidos ABERTOS podem ser cancelados.
 *
 * Os objetos guardados têm o shape de PedidoDetalheResponse; a listagem
 * projeta o subconjunto de PedidoResumoResponse.
 */
import { ITENS_POR_ID, MESAS_POR_ID } from './seed';
import { emitirNotificacao, montarMensagem } from './notificacaoBus';

const STORAGE_KEY = 'pi3b-mock-pedidos';

// Simulação de cozinha (só no mock): depois que o garçom ENVIA o pedido, a
// "cozinha" avança o status sozinha, disparando as notificações que o garçom
// receberia via WebSocket na vida real.
const DELAY_EM_PREPARO = 5000;  // 5s após enviar
const DELAY_PRONTO = 12000;     // 12s após enviar

function gerarId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'mock-' + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function agoraISO() {
    return new Date().toISOString();
}

function carregar() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function salvar(pedidos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
    } catch { /* espaço cheio ou indisponível — ignora no mock */ }
}

function nomeGarcomLogado() {
    try {
        const user = JSON.parse(localStorage.getItem('pi3b-user'));
        return user?.nome || user?.username || 'Garçom';
    } catch {
        return 'Garçom';
    }
}

/** Projeta um pedido completo no shape resumido (PedidoResumoResponse). */
function toResumo(pedido) {
    return {
        id: pedido.id,
        numeroMesa: pedido.numeroMesa,
        nomeGarcom: pedido.nomeGarcom,
        status: pedido.status,
        total: pedido.total,
        criadoEm: pedido.criadoEm,
    };
}

// ----------------------------------------------------------------
// POST /pedidos
// ----------------------------------------------------------------
export function criarPedidoMock({ mesaId, itens }) {
    const mesa = MESAS_POR_ID[mesaId];
    if (!mesa) throw new Error('Mesa não encontrada');

    const itensResolvidos = (itens || []).map((itemReq) => {
        const doCardapio = ITENS_POR_ID[itemReq.itemCardapioId];
        if (!doCardapio) throw new Error('Item do cardápio não encontrado');

        const precoUnitario = doCardapio.preco;
        const quantidade = Number(itemReq.quantidade) || 1;
        return {
            id: gerarId(),
            nomeItem: doCardapio.nome,
            quantidade,
            precoUnitario,
            subtotal: precoUnitario * quantidade,
            personalizacoes: itemReq.personalizacoes || null,
        };
    });

    const total = itensResolvidos.reduce((soma, i) => soma + i.subtotal, 0);

    const pedido = {
        id: gerarId(),
        numeroMesa: mesa.numero,
        nomeGarcom: nomeGarcomLogado(),
        status: 'ABERTO',
        total,
        criadoEm: agoraISO(),
        itens: itensResolvidos,
    };

    const pedidos = carregar();
    pedidos.unshift(pedido);
    salvar(pedidos);

    return pedido;
}

// ----------------------------------------------------------------
// GET /pedidos/meus  (resumo)
// ----------------------------------------------------------------
export function listarMeusPedidosMock() {
    return carregar().map(toResumo);
}

// ----------------------------------------------------------------
// GET /pedidos/{id}  (detalhe completo)
// ----------------------------------------------------------------
export function buscarPedidoMock(id) {
    const pedido = carregar().find((p) => p.id === id);
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
}

// ----------------------------------------------------------------
// PATCH /pedidos/{id}/status
// ----------------------------------------------------------------
export function atualizarStatusMock(id, novoStatus) {
    const pedidos = carregar();
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error('Pedido não encontrado');

    pedido.status = novoStatus;
    salvar(pedidos);

    // Ao enviar para a cozinha, dispara a simulação que gera as notificações.
    if (novoStatus === 'ENVIADO') {
        simularCozinha(pedido.id);
    }

    return toResumo(pedido);
}

/**
 * Avança o status de um pedido "por conta da cozinha" e emite a notificação.
 * Não mexe em pedidos já finalizados/cancelados pelo garçom.
 */
function avancarComNotificacao(pedidoId, novoStatus) {
    const pedidos = carregar();
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;
    if (pedido.status === 'ENTREGUE' || pedido.status === 'CANCELADO') return;

    pedido.status = novoStatus;
    salvar(pedidos);

    emitirNotificacao({
        pedidoId,
        numeroMesa: pedido.numeroMesa,
        novoStatus,
        mensagem: montarMensagem(pedido.numeroMesa, novoStatus),
    });
}

/** Agenda o avanço automático ENVIADO → EM_PREPARO → PRONTO (mock). */
function simularCozinha(pedidoId) {
    setTimeout(() => avancarComNotificacao(pedidoId, 'EM_PREPARO'), DELAY_EM_PREPARO);
    setTimeout(() => avancarComNotificacao(pedidoId, 'PRONTO'), DELAY_PRONTO);
}

// ----------------------------------------------------------------
// DELETE /pedidos/{id}  (cancelar — só se ABERTO)
// ----------------------------------------------------------------
export function cancelarPedidoMock(id) {
    const pedidos = carregar();
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error('Pedido não encontrado');

    if (pedido.status !== 'ABERTO') {
        throw new Error('Só é possível cancelar pedidos com status ABERTO');
    }

    pedido.status = 'CANCELADO';
    salvar(pedidos);
}
