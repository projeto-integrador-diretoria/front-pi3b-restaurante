import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Cliente WebSocket real — STOMP sobre SockJS.
 *
 * Conecta ao endpoint /ws do back (WebSocketConfig) e assina o canal do garçom
 * autenticado: /topic/pedidos/{funcionarioId}. Cada mensagem recebida tem o shape:
 *   { pedidoId, numeroMesa, novoStatus, mensagem }
 *
 * @returns {() => void} função que encerra a conexão.
 */
export function conectarStomp({ baseURL, funcionarioId, onMensagem, onStatus }) {
    const client = new Client({
        // SockJS é usado porque o back registra o endpoint com .withSockJS().
        webSocketFactory: () => new SockJS(`${baseURL}/ws`),
        reconnectDelay: 5000, // tenta reconectar sozinho a cada 5s se cair
        onConnect: () => {
            onStatus?.('conectado');
            client.subscribe(`/topic/pedidos/${funcionarioId}`, (frame) => {
                try {
                    onMensagem(JSON.parse(frame.body));
                } catch {
                    /* ignora payloads que não sejam JSON válido */
                }
            });
        },
        onStompError: () => onStatus?.('erro'),
        onWebSocketClose: () => onStatus?.('desconectado'),
    });

    client.activate();

    return () => {
        client.deactivate();
    };
}
