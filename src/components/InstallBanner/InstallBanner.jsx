import { Download } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import './InstallBanner.css';

/**
 * Banner fixo na base da tela de login para instalar o PWA.
 * Só é renderizado quando o browser sinalizou que o app é instalável
 * e ele ainda não está rodando em modo standalone.
 */
function InstallBanner() {
  const { isInstallable, install, hasNativePrompt } = useInstallPrompt();

  if (!isInstallable) return null;

  const handleInstallClick = () => {
    if (hasNativePrompt) {
      install();
    } else {
      // Fallback para iOS ou navegadores bloqueando o prompt nativo
      alert(
        "Para instalar o aplicativo:\n\n" +
        "1. Toque no ícone de opções/compartilhamento do navegador.\n" +
        "2. Selecione 'Adicionar à tela inicial'."
      );
      // Pede notificação também no fluxo manual se suportado
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="install-banner" role="banner" aria-label="Instalar aplicativo">
      <p className="install-banner__text">
        Instale o app para melhor experiência
      </p>
      <button
        className="install-banner__btn"
        onClick={handleInstallClick}
        aria-label="Instalar aplicativo"
      >
        <Download size={16} strokeWidth={2.5} aria-hidden="true" />
        Instalar
      </button>
    </div>
  );
}

export default InstallBanner;
