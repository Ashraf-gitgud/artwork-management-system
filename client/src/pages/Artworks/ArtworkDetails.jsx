import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  useGetArtworkByIdQuery,
  useUpdateArtworkMutation,
} from '../../features/artworks/artworkApi';
import ArtworkForm from '../../features/artworks/ArtworkForm';
import ArtworkStatus from '../../features/artworks/ArtworkStatus';
import StatusChangeModel from '../../features/artworks/StatusChangeModel';
import SellModal from '../../features/artworks/SellModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ImageLightbox from '../../components/ui/ImageLightbox';
import { ArrowLeft, Pencil, RefreshCw, ShoppingCart } from 'lucide-react';

export default function ArtworkDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = searchParams.get('edit') === '1';

  const { data: artwork, isLoading, isError } = useGetArtworkByIdQuery(id);
  const [updateArtwork, { isLoading: isUpdating }] = useUpdateArtworkMutation();

  const [statusOpen, setStatusOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (isLoading) return <Spinner />;
  if (isError || !artwork) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md">
        Failed to load artwork.
      </div>
    );
  }

  const handleUpdate = async (payload) => {
    try {
      await updateArtwork({ id, ...payload }).unwrap();
      navigate(`/artworks/${id}`);
    } catch {
      // ignore
    }
  };

  if (isEditMode) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => navigate(`/artworks/${id}`)}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Card title="Edit Artwork">
          <ArtworkForm
            defaultValues={artwork}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            submitLabel="Save Changes"
          />
        </Card>
      </div>
    );
  }

  const artistName = artwork.artistId
    ? `${artwork.artistId.firstName || ''} ${artwork.artistId.lastName || ''}`.trim()
    : '—';
  const categoryName = artwork.categoryId?.name || '—';
  const dims = artwork.dimensions;
  const canSell = !['sold', 'missing', 'returned'].includes(artwork.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/artworks">
          <Button variant="ghost">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <div className="flex-1" />
        <Link to={`/artworks/${id}?edit=1`}>
          <Button variant="secondary">
            <Pencil size={16} /> Edit
          </Button>
        </Link>
        <Button variant="secondary" onClick={() => setStatusOpen(true)}>
          <RefreshCw size={16} /> Status
        </Button>
        {canSell && (
          <Button onClick={() => setSellOpen(true)}>
            <ShoppingCart size={16} /> Sell
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-48 bg-navy-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            {artwork.imageUrl ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="w-full h-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded-lg"
                title="View full image"
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <span className="text-navy-400 text-sm">No image</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-navy-900">{artwork.title}</h1>
            <p className="text-navy-600">Artist: {artistName}</p>
            <p className="text-navy-600">Category: {categoryName}</p>
            <div className="flex items-center gap-3 pt-1">
              <ArtworkStatus status={artwork.status} />
              <span className="text-sm text-navy-500">{artwork.condition}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Creation Information">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-500">Creation date</dt>
              <dd className="text-navy-900">
                {artwork.creationDate
                  ? new Date(artwork.creationDate).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Medium</dt>
              <dd className="text-navy-900">{artwork.medium || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Technique</dt>
              <dd className="text-navy-900">{artwork.technique || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Material</dt>
              <dd className="text-navy-900">{artwork.material || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Signature</dt>
              <dd className="text-navy-900">{artwork.signatureLocation || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Certificate</dt>
              <dd className="text-navy-900">
                {artwork.creationCertificate ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Physical Information">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-500">Dimensions</dt>
              <dd className="text-navy-900">
                {dims
                  ? `${dims.height} × ${dims.width}${
                      dims.depth ? ` × ${dims.depth}` : ''
                    } ${dims.unit || ''}`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Condition</dt>
              <dd className="text-navy-900">{artwork.condition || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Inventory Information">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-500">Depositor CIN</dt>
              <dd className="text-navy-900">{artwork.depositorCin || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Inventory date</dt>
              <dd className="text-navy-900">
                {artwork.inventoryDate
                  ? new Date(artwork.inventoryDate).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Buyer CIN</dt>
              <dd className="text-navy-900">{artwork.buyerCin || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-500">Exit date</dt>
              <dd className="text-navy-900">
                {artwork.exitDate
                  ? new Date(artwork.exitDate).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
          </dl>
        </Card>

        {artwork.notes && (
          <Card title="Notes">
            <p className="text-sm text-navy-700 whitespace-pre-wrap">
              {artwork.notes}
            </p>
          </Card>
        )}
      </div>

      <StatusChangeModel
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        artwork={artwork}
      />
      <SellModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
        artwork={artwork}
      />
      <ImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={artwork.imageUrl}
        alt={artwork.title}
      />
    </div>
  );
}