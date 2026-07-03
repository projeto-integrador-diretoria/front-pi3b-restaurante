import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageHeader } from '../../context/PageHeaderContext';
import './PageHeader.css';

/**
 * Header global renderizado pelo MainLayout em todas as páginas autenticadas.
 * O conteúdo é controlado via usePageHeader() em cada página.
 */
function PageHeader() {
  const { title, subtitle, showBack, onBack } = usePageHeader();
  const navigate = useNavigate();

  if (!title) return null;

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }

  return (
    <header className={`page-header${showBack ? ' page-header--with-back' : ''}`}>
      {showBack && (
        <button
          className="page-header__back"
          onClick={handleBack}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
      )}

      <div className="page-header__text">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && (
          <p className="page-header__subtitle">{subtitle}</p>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
