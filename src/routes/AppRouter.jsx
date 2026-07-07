import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/HomePage/HomePage';
import NewOrderPage from '../pages/NewOrderPage/NewOrderPage';
import OrderDetailPage from '../pages/OrderDetailPage/OrderDetailPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública — sem NavBar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas com NavBar (MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/novo-pedido" element={<NewOrderPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        {/* Default route e Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
