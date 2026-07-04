import { Outlet } from 'react-router-dom';
import { PageHeaderProvider } from '../context/PageHeaderContext';
import { NotificacoesProvider } from '../context/NotificacoesContext';
import PageHeader from '../components/PageHeader/PageHeader';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar';
import ToastHost from '../components/Toast/ToastHost';
import './MainLayout.css';

/**
 * Layout principal da aplicação.
 * Envolve todas as rotas autenticadas com o PageHeaderProvider,
 * renderiza o PageHeader (controlado por cada página via usePageHeader)
 * e a BottomNavBar fixa na base.
 */
function MainLayout() {
  return (
    <NotificacoesProvider>
      <PageHeaderProvider>
        <div className="main-layout">
          <main className="main-layout__content">
            <PageHeader />
            <Outlet />
          </main>
          <BottomNavBar />
          <ToastHost />
        </div>
      </PageHeaderProvider>
    </NotificacoesProvider>
  );
}

export default MainLayout;
