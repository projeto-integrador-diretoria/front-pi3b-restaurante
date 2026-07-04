/**
 * Serviço de mesas.
 *
 * ⚠️ ATENÇÃO / DÍVIDA COM O BACK-END:
 * O POST /pedidos exige `mesaId` (UUID da entidade Mesa), mas a API ainda
 * NÃO expõe um endpoint para listar/consultar mesas. O MesaRepository já tem
 * os métodos prontos (`buscarTodasOrdenadas`, `buscarPorNumero`) — falta só um
 * `MesaController` com `GET /mesas`. Enquanto isso, no modo real este serviço
 * aponta para `GET /mesas` (a ser criado); no mock, resolve localmente.
 *
 * Shape esperado: [{ id, numero, status }]
 */
import api from './api';
import { USE_MOCK, delay } from './config';
import { MESAS_MOCK } from './mock/seed';

export async function listarMesas() {
    if (USE_MOCK) {
        await delay();
        return MESAS_MOCK;
    }
    const { data } = await api.get('/mesas');
    return data;
}

/**
 * Resolve o número digitado pelo garçom para a mesa correspondente.
 * Retorna null se não existir mesa com aquele número.
 */
export async function buscarMesaPorNumero(numero) {
    const alvo = Number(numero);
    const mesas = await listarMesas();
    return mesas.find((m) => m.numero === alvo) || null;
}
