import { useEffect } from 'react';
import { usePageHeader } from '../../context/PageHeaderContext';
import './HomePage.css';

function HomePage() {
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Pedidos',
      subtitle: 'Olá, Gabriel',
    });
  }, [setHeader]);

  return (
    <div className="page-placeholder">
      <p className="page-placeholder__desc">Em desenvolvimento</p>
    </div>
  );
}

export default HomePage;
