import { Link } from 'react-router-dom';
import { Eye, Pencil, RefreshCw, ShoppingCart } from 'lucide-react';
import ArtworkStatus from './ArtworkStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function ArtworkTable({
  artworks,
  onStatusClick,
  onSellClick,
}) {
  if (!artworks?.length) {
    return <EmptyState title="No artworks found" description="Try adjusting filters or add a new artwork." />;
  }

  return (
    <div className="overflow-x-auto border border-navy-200 rounded-lg bg-white">
      <table className="min-w-full divide-y divide-navy-100 text-sm">
        <thead className="bg-navy-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">Title</th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">Artist</th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">Category</th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">Condition</th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">Status</th>
            <th className="px-4 py-3 text-right font-semibold text-navy-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {artworks.map((art) => {
            const artistName = art.artistId
              ? `${art.artistId.firstName || ''} ${art.artistId.lastName || ''}`.trim()
              : '—';
            const categoryName = art.categoryId?.name || '—';
            const canSell = !['sold', 'missing', 'returned'].includes(art.status);

            return (
              <tr key={art._id} className="hover:bg-navy-50/50">
                <td className="px-4 py-3 font-medium text-navy-900">{art.title}</td>
                <td className="px-4 py-3 text-navy-700">{artistName}</td>
                <td className="px-4 py-3 text-navy-700">{categoryName}</td>
                <td className="px-4 py-3 text-navy-700">{art.condition || '—'}</td>
                <td className="px-4 py-3">
                  <ArtworkStatus status={art.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/artworks/${art._id}`}>
                      <Button variant="ghost" className="!px-2 !py-1.5" title="View">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link to={`/artworks/${art._id}?edit=1`}>
                      <Button variant="ghost" className="!px-2 !py-1.5" title="Edit">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="!px-2 !py-1.5"
                      title="Change status"
                      onClick={() => onStatusClick(art)}
                    >
                      <RefreshCw size={16} />
                    </Button>
                    {canSell && (
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        title="Sell"
                        onClick={() => onSellClick(art)}
                      >
                        <ShoppingCart size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}