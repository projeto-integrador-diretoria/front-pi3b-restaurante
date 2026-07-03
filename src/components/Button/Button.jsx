import { Loader2 } from 'lucide-react';
import './Button.css';

function Button({
                    children,
                    variant = 'primary',
                    fullWidth = false,
                    loading = false,
                    disabled = false,
                    type = 'button',
                    className = '',
                    ...props
                }) {
    return (
        <button
            type={type}
            className={['btn', `btn--${variant}`, fullWidth && 'btn--full', className]
                .filter(Boolean)
                .join(' ')}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 size={20} className="btn__spinner" /> : children}
        </button>
    );
}

export default Button;