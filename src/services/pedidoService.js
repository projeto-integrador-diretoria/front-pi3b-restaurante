/**
 * Serviço de pedidos — espelha o PedidoController do back-end (branch agoravaicrud).
 *
 * Endpoints:
 *   POST   /pedidos              → cria pedido do garçom autenticado (JWT)
 *   GET    /pedidos/meus         → pedidos do garçom logado (resumo)
 *   GET    /pedidos/{id}         → detalhe completo (com itens)
 *   PATCH  /pedidos/{id}/status  → avança o status
 *   DELETE /pedidos/{id}         → cancela (só se ABERTO)
 *
 * O garçom NÃO é enviado no corpo: o back o identifica pelo token JWT.
 */
import api from './api';
import { USE_MOCK, delay } from './config';
import {
    criarPedidoMock,
    listarMeusPedidosMock,
    buscarPedidoMock,
    atualizarStatusMock,
    cancelarPedidoMock,
} from './mock/pedidoStore';

/**
 * Cria um novo pedido.
 * @param {{ mesaId: string, itens: Array<{itemCardapioId: string, quantidade: number, personalizacoes?: string}> }} payload
 * @returns PedidoDetalheResponse
 */
export async function criarPedido(payload) {
    if (USE_MOCK) {
        await delay();
        return criarPedidoMock(payload);
    }
    const { data } = await api.post('/pedidos', payload);
    return data;
}

/** Lista os pedidos do garçom autenticado (shape resumido). */
export async function listarMeusPedidos() {
    if (USE_MOCK) {
        await delay();
        return listarMeusPedidosMock();
    }
    const { data } = await api.get('/pedidos/meus');
    return data;
}

/** Detalhe completo de um pedido, incluindo itens. */
export async function buscarPedido(id) {
    if (USE_MOCK) {
        await delay();
        return buscarPedidoMock(id);
    }
    const { data } = await api.get(`/pedidos/${id}`);
    return data;
}

/** Atualiza o status do pedido (ex: ABERTO → ENVIADO). */
export async function atualizarStatusPedido(id, status) {
    if (USE_MOCK) {
        await delay();
        return atualizarStatusMock(id, status);
    }
    const { data } = await api.patch(`/pedidos/${id}/status`, { status });
    return data;
}

/** Cancela o pedido (só permitido enquanto ABERTO). */
export async function cancelarPedido(id) {
    if (USE_MOCK) {
        await delay();
        return cancelarPedidoMock(id);
    }
    await api.delete(`/pedidos/${id}`);
}
