import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import InstallBanner from '../../components/InstallBanner/InstallBanner';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setErro('');

        if (!username.trim() || !senha.trim()) {
            setErro('Preencha usuário e senha para continuar.');
            return;
        }

        setCarregando(true);
        try {
            await login(username.trim(), senha);
            navigate('/home');
        } catch (err) {
            if (err.response?.status === 401) {
                setErro('Usuário ou senha inválidos.');
            } else {
                setErro('Não foi possível entrar. Tente novamente em instantes.');
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-page__content">
                <div className="login-page__icon">
                    <Utensils size={44} strokeWidth={1.5} />
                </div>

                <h1 className="login-page__title">Garçom App</h1>
                <p className="login-page__subtitle">Acesse para gerenciar os pedidos</p>

                <form className="login-page__card" onSubmit={handleSubmit} noValidate>
                    <Input
                        type="text"
                        placeholder="Usuário"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={carregando}
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        disabled={carregando}
                    />

                    {erro && (
                        <p className="login-page__error" role="alert">
                            {erro}
                        </p>
                    )}

                    <Button type="submit" fullWidth loading={carregando}>
                        Entrar
                    </Button>
                </form>
            </div>

            <InstallBanner />
        </div>
    );
}

export default LoginPage;