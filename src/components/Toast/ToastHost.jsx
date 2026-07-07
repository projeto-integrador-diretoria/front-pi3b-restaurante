import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../context/NotificacoesContext';
import Toast from './Toast';
import './Toast.css';

/**
 * Camada que empilha e exibe os toasts de notificação no topo da tela.
 * Renderizado uma vez pelo MainLayout. Tocar num toast abre o pedido.
 */
function ToastHost() {
    const { toasts, descartarToast } = useNotificacoes();
    const navigate = useNavigate();

    if (toasts.length === 0) return null;

    function abrir(notificacao) {
        descartarToast(notificacao.chave);
        if (notificacao.pedidoId) navigate(`/pedidos/${notificacao.pedidoId}`);
    }

    return (
        <div className="toast-host" aria-live="polite">
            {toasts.map((t) => (
                <Toast
                    key={t.chave}
                    notificacao={t}
                    onDescartar={descartarToast}
                    onAbrir={abrir}
                />
            ))}
        </div>
    );
}

export default ToastHost;
