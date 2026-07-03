import { useNavigate } from 'react-router-dom';
import InstallBanner from '../../components/InstallBanner/InstallBanner';
import './LoginPage.css';

/**
 * Página de Login
 * NavBar não é renderizada nesta rota (fora do MainLayout).
 * Exibe o banner de instalação PWA quando disponível.
 */
function LoginPage() {

  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title text-serif">
          Bem-vindo
        </h1>
        <p className="login-card__subtitle">
          Faça login para continuar
        </p>
        <p className="page-placeholder__desc">Em desenvolvimento</p>
      </div>

      <button onClick={() => navigate('/home')} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
        Simular login
      </button>

      {/* Banner de instalação PWA — renderiza null automaticamente se não disponível */}
      <InstallBanner />
    </div>
  );
}

export default LoginPage;
