/**
 * Serviço de cardápio.
 *
 * GET /cardapio → lista de categorias, cada uma com seus itens disponíveis.
 * Shape: [{ categoriaId, categoriaNome, itens: [{ id, nome, descricao, preco }] }]
 */
import api from './api';
import { USE_MOCK, delay } from './config';
import { CARDAPIO_MOCK } from './mock/seed';

export async function getCardapio() {
    if (USE_MOCK) {
        await delay();
        return CARDAPIO_MOCK;
    }
    const { data } = await api.get('/cardapio');
    return data;
}
