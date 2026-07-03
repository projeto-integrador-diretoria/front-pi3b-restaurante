import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = forwardRef(function Input(
    { label, type = 'text', error, className = '', id, ...props },
    ref
) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`input-field${error ? ' input-field--error' : ''} ${className}`}>
            {label && (
                <label className="input-field__label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <div className="input-field__wrapper">
                <input
                    ref={ref}
                    id={inputId}
                    type={resolvedType}
                    className={`input-field__control${isPassword ? ' input-field__control--with-icon' : ''}`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="input-field__toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff size={20} strokeWidth={1.75} />
                        ) : (
                            <Eye size={20} strokeWidth={1.75} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="input-field__error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;