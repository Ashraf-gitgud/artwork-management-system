import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const titles = {
  '/dashboard': 'Dashboard',
  '/artworks': 'Artworks',
  '/artworks/new': 'New Artwork',
  '/records': 'Records',
  '/artists': 'Artists',
  '/buyers': 'Buyers',
  '/depositors': 'Depositors',
  '/categories': 'Categories',
  '/profile': 'Profile',
};

export default function Header({ onMenuClick }) {
  const user = useSelector((s) => s.auth.user);
  const { pathname } = useLocation();

  let title = titles[pathname];
  if (!title && pathname.startsWith('/artworks/')) {
    title = 'Artwork Details';
  }
  if (!title) title = 'Gallery';

  return (
    <header className="h-14 bg-white border-b border-navy-200 flex items-center px-4 gap-4 shrink-0">
      <button
        className="lg:hidden text-navy-700 p-1"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <h1 className="text-lg font-semibold text-navy-900 flex-1 truncate">
        {title}
      </h1>
      <div className="text-sm text-navy-600 hidden sm:block">
        {user?.firstName} {user?.lastName}
      </div>
    </header>
  );
}