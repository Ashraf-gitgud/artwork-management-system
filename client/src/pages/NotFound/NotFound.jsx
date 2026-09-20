import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-50 px-4">
      <h1 className="text-6xl font-bold text-navy-800">404</h1>
      <p className="mt-4 text-lg text-navy-600">Page not found</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}