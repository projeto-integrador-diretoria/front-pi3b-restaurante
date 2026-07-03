import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar o fluxo de instalação do PWA.
 *
 * Retorna:
 *  - isInstallable {boolean} — true quando o browser disparou beforeinstallprompt
 *                              e o app ainda não está rodando em modo standalone
 *  - isInstalled   {boolean} — true quando o app está rodando como PWA instalado
 *  - install       {function} — dispara o prompt nativo e, após aceite, pede
 *                               permissão de notificações
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detecta se o app já está rodando em modo standalone (já instalado)
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    console.log('[PWA] Inicial: display-mode standalone?', standaloneQuery.matches);
    setIsInstalled(standaloneQuery.matches);

    const onStandaloneChange = (e) => {
      console.log('[PWA] display-mode mudou para standalone?', e.matches);
      setIsInstalled(e.matches);
    };
    standaloneQuery.addEventListener('change', onStandaloneChange);

    // Captura o evento de instalação antes que o browser o descarte
    const onBeforeInstallPrompt = (e) => {
      console.log('[PWA] Evento beforeinstallprompt disparado pelo browser!');
      e.preventDefault(); // impede o mini-infobar automático do Chrome
      setDeferredPrompt(e);
    };

    // Limpa o prompt quando o app é instalado via outro caminho
    const onAppInstalled = () => {
      console.log('[PWA] Evento appinstalled disparado! App foi instalado com sucesso.');
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      standaloneQuery.removeEventListener('change', onStandaloneChange);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    console.log('[PWA] Tentando instalar...', { deferredPrompt });
    if (!deferredPrompt) return;

    // 1. Dispara o diálogo nativo de instalação
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Resultado do prompt de instalação:', outcome);

    // 2. Limpa o prompt — independente da escolha do usuário
    setDeferredPrompt(null);

    // 3. Se o usuário aceitou instalar, pede permissão de notificações
    //    (feito dentro do clique do usuário para respeitar a política do browser)
    if (outcome === 'accepted' && 'Notification' in window) {
      await Notification.requestPermission();
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !isInstalled, // Mostra o banner se não estiver rodando no app instalado
    isInstalled,
    install,
    hasNativePrompt: !!deferredPrompt,
  };
}
