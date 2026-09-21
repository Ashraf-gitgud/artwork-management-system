import { Link } from 'react-router-dom';
import { Eye, Pencil, RefreshCw, ShoppingCart, RotateCcw } from 'lucide-react';
import ArtworkStatus from './ArtworkStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { isBinStatus } from './artworkUtils';

export default function ArtworkTable({
  artworks,
  onStatusClick,
  onSellClick,
  onReclaimClick,
  showReclaim = false,
}) {
  if (!artworks?.length) {
    return (
      <EmptyState
        title="No artworks found"
        description="Try adjusting filters or add a new artwork."
      />
    );
  }

  return (
    <div className="overflow-x-auto border border-navy-200 rounded-lg bg-white">
      <table className="min-w-full divide-y divide-navy-100 text-sm">
        <thead className="bg-navy-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-navy-700 w-14">
              
            </th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">
              Title
            </th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">
              Artist
            </th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">
              Category
            </th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">
              Condition
            </th>
            <th className="px-4 py-3 text-left font-semibold text-navy-700">
              Status
            </th>
            <th className="px-4 py-3 text-right font-semibold text-navy-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {artworks.map((art) => {
            const artistId = art.artistId?._id || art.artistId;
            const artistName = art.artistId
              ? `${art.artistId.firstName || ''} ${art.artistId.lastName || ''}`.trim()
              : '—';
            const categoryName = art.categoryId?.name || '—';
            const canSell = !isBinStatus(art.status) && art.status !== 'returned';
            const canReclaim = isBinStatus(art.status);

            return (
              <tr key={art._id} className="hover:bg-navy-50/50">
                <td className="px-4 py-2">
                  <div className="w-10 h-10 rounded bg-navy-100 overflow-hidden flex items-center justify-center shrink-0">
                    {art.imageUrl ? (
                      <img
                        src={art.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-navy-400">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {art.title}
                </td>
                <td className="px-4 py-3 text-navy-700">
                  {artistId ? (
                    <Link
                      to={`/artworks?artistId=${artistId}`}
                      className="text-navy-700 hover:text-navy-900 hover:underline"
                    >
                      {artistName}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-navy-700">{categoryName}</td>
                <td className="px-4 py-3 text-navy-700">
                  {art.condition || '—'}
                </td>
                <td className="px-4 py-3">
                  <ArtworkStatus status={art.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/artworks/${art._id}`}>
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        title="View"
                      >
                        <Eye size={16} />
                      </Button>
                    </Link>
                    {!showReclaim && (
                      <>
                        <Link to={`/artworks/${art._id}?edit=1`}>
                          <Button
                            variant="ghost"
                            className="!px-2 !py-1.5"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="!px-2 !py-1.5"
                          title="Change status"
                          onClick={() => onStatusClick?.(art)}
                        >
                          <RefreshCw size={16} />
                        </Button>
                        {canSell && (
                          <Button
                            variant="ghost"
                            className="!px-2 !py-1.5"
                            title="Sell"
                            onClick={() => onSellClick?.(art)}
                          >
                            <ShoppingCart size={16} />
                          </Button>
                        )}
                      </>
                    )}
                    {showReclaim && canReclaim && (
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        title={
                          art.status === 'sold'
                            ? 'Reclaim as Returned'
                            : 'Reclaim to In Storage'
                        }
                        onClick={() => onReclaimClick?.(art)}
                      >
                        <RotateCcw size={16} />
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