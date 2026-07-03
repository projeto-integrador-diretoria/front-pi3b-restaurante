import { NavLink } from 'react-router-dom';
import { House, Plus, CircleUser } from 'lucide-react';
import './BottomNavBar.css';

const NAV_ITEMS = [
  {
    to: '/home',
    label: 'Início',
    icon: House,
    end: false,
  },
  {
    to: '/novo-pedido',
    label: 'Novo Pedido',
    icon: Plus,
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: CircleUser,
  },
];

function BottomNavBar() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            ['bottom-nav__item', isActive && 'bottom-nav__item--active']
              .filter(Boolean)
              .join(' ')
          }
          aria-label={label}
        >
          <span className="bottom-nav__icon-wrap">
            <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavBar;
