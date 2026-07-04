/**
 * Configuração da camada de serviços.
 *
 * USE_MOCK controla se o front conversa com a API real (Spring Boot) ou com
 * um mock local (dados em memória + localStorage).
 *
 * Enquanto o CRUD de pedidos + WebSocket (branch `agoravaicrud`) não estão na
 * main da API — e enquanto não existe um endpoint `GET /mesas` —, o mock deixa
 * o app 100% funcional e demonstrável sem depender do back.
 *
 * Para integrar com a API real, defina no arquivo `.env`:
 *   VITE_USE_MOCK=false
 *   VITE_API_URL=http://localhost:8080
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/** Pequeno atraso artificial no mock para simular latência de rede (ms). */
export const MOCK_DELAY = 350;

/** Resolve uma Promise após `ms`, apenas para dar realismo ao mock. */
export function delay(ms = MOCK_DELAY) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
