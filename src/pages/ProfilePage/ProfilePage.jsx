import { useEffect } from 'react';
import { usePageHeader } from '../../context/PageHeaderContext';
import './ProfilePage.css';

function ProfilePage() {
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Perfil',
    });
  }, [setHeader]);

  return (
    <div className="page-placeholder">
      <p className="page-placeholder__desc">Em desenvolvimento</p>
    </div>
  );
}

export default ProfilePage;
