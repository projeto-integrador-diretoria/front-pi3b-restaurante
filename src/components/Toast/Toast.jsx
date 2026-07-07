import { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const DURACAO = 6000; // tempo visível antes de sumir sozinho (ms)

/**
 * Um toast de notificação. Some sozinho após DURACAO ou ao tocar no X.
 *
 * @param {object}   notificacao - { chave, numeroMesa, mensagem, ... }
 * @param {function} onDescartar - (chave) => remove o toast
 * @param {function} onAbrir     - (notificacao) => ação ao tocar no corpo (abrir pedido)
 */
function Toast({ notificacao, onDescartar, onAbrir }) {
    useEffect(() => {
        const timer = setTimeout(() => onDescartar(notificacao.chave), DURACAO);
        return () => clearTimeout(timer);
    }, [notificacao.chave, onDescartar]);

    return (
        <div className="toast" role="status">
            <button className="toast__corpo" onClick={() => onAbrir?.(notificacao)}>
                <span className="toast__icone">
                    <Bell size={18} strokeWidth={2} />
                </span>
                <span className="toast__texto">{notificacao.mensagem}</span>
            </button>

            <button
                className="toast__fechar"
                onClick={() => onDescartar(notificacao.chave)}
                aria-label="Dispensar notificação"
            >
                <X size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
}

export default Toast;
