/**
 * Serviço de notificações de pedidos.
 *
 * Abstrai a origem das notificações conforme VITE_USE_MOCK:
 *   - Mock: escuta o barramento local (simulador de cozinha do pedidoStore).
 *   - Real: STOMP sobre SockJS no canal /topic/pedidos/{funcionarioId}.
 *
 * As telas não sabem qual está ativo — recebem o mesmo payload dos dois jeitos.
 *
 * @returns {Promise<() => void>} Promise que resolve com a função de desconexão.
 */
import { USE_MOCK } from './config';
import { assinarNotificacoes } from './mock/notificacaoBus';

export async function conectarNotificacoes({ funcionarioId, onMensagem, onStatus }) {
    // Sem funcionário autenticado não há canal para assinar.
    if (!funcionarioId) return () => {};

    if (USE_MOCK) {
        onStatus?.('conectado');
        return assinarNotificacoes(onMensagem);
    }

    // Carrega o cliente STOMP/SockJS só no modo real (fica num chunk separado).
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const { conectarStomp } = await import('./stompClient');
    return conectarStomp({ baseURL, funcionarioId, onMensagem, onStatus });
}
