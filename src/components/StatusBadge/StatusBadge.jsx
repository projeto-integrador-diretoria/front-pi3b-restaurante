import { getStatusMeta } from '../../utils/pedidoStatus';
import './StatusBadge.css';

/**
 * Badge colorido do status do pedido.
 * Cor e rótulo vêm de STATUS_META (utils/pedidoStatus).
 */
function StatusBadge({ status }) {
    const { label, cor, fundo } = getStatusMeta(status);

    return (
        <span
            className="status-badge"
            style={{ color: cor, background: fundo }}
        >
            <span className="status-badge__dot" style={{ background: cor }} />
            {label}
        </span>
    );
}

export default StatusBadge;
