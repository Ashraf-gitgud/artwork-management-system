import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-navy-900">
          Welcome, {user?.firstName || 'User'}
        </h2>
        <p className="mt-2 text-navy-600">
          Use the sidebar to manage artworks, artists, buyers, depositors and
          categories.
        </p>
      </Card>
    </div>
  );
}