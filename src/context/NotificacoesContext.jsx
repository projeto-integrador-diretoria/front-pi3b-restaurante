import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { conectarNotificacoes } from '../services/notificacaoService';

const NotificacoesContext = createContext(null);

/**
 * Provider de notificações de pedidos.
 *
 * Conecta ao fluxo de notificações (WebSocket real ou mock) assim que há um
 * garçom autenticado e mantém:
 *   - notificacoes: histórico recebido (mais recentes primeiro)
 *   - toasts:       notificações ainda visíveis na tela
 *   - ultima:       a última notificação (usada para atualizar as listas)
 */
export function NotificacoesProvider({ children }) {
    const { user } = useAuth();
    const funcionarioId = user?.id;

    const [notificacoes, setNotificacoes] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [ultima, setUltima] = useState(null);
    const [conectado, setConectado] = useState(false);

    useEffect(() => {
        if (!funcionarioId) return;

        let desconectar = () => {};
        let ativo = true;

        conectarNotificacoes({
            funcionarioId,
            onStatus: (status) => setConectado(status === 'conectado'),
            onMensagem: (msg) => {
                const nova = {
                    ...msg,
                    // chave única mesmo que o mesmo pedido notifique várias vezes
                    chave: `${msg.pedidoId}-${msg.novoStatus}-${Date.now()}`,
                    recebidoEm: new Date().toISOString(),
                };
                setUltima(nova);
                setNotificacoes((lista) => [nova, ...lista].slice(0, 50));
                setToasts((lista) => [...lista, nova]);
            },
        }).then((fn) => {
            // Se o componente desmontou antes de conectar, já desconecta.
            if (ativo) desconectar = fn;
            else fn?.();
        });

        return () => {
            ativo = false;
            desconectar?.();
        };
    }, [funcionarioId]);

    const descartarToast = useCallback((chave) => {
        setToasts((lista) => lista.filter((t) => t.chave !== chave));
    }, []);

    const limparHistorico = useCallback(() => setNotificacoes([]), []);

    return (
        <NotificacoesContext.Provider
            value={{ notificacoes, toasts, ultima, conectado, descartarToast, limparHistorico }}
        >
            {children}
        </NotificacoesContext.Provider>
    );
}

/** Hook para consumir as notificações em qualquer página. */
export function useNotificacoes() {
    const ctx = useContext(NotificacoesContext);
    if (!ctx) throw new Error('useNotificacoes deve ser usado dentro de <NotificacoesProvider>');
    return ctx;
}
