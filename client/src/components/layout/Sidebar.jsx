import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { baseApi } from '../../api/baseApi';
import {
  LayoutDashboard,
  Image,
  Archive,
  Users,
  UserCheck,
  Package,
  Tags,
  User,
  LogOut,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/artworks', label: 'Artworks', icon: Image },
  { to: '/records', label: 'Records', icon: Archive },
  { to: '/artists', label: 'Artists', icon: Users },
  { to: '/buyers', label: 'Buyers', icon: UserCheck },
  { to: '/depositors', label: 'Depositors', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
];

export default function Sidebar({ open, onClose }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-900 text-navy-100
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-navy-700">
          <span className="font-serif text-xl font-medium tracking-wide">Dar d'Art Gallery</span>
          <button className="lg:hidden p-1" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-navy-700 space-y-1">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition
              ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <User size={18} />
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-navy-200 hover:bg-navy-800 hover:text-white transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}