import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGetArtworksQuery } from '../../features/artworks/artworkApi';
import { useGetArtistsQuery } from '../../features/artists/artistApi';
import { useGetCategoriesQuery } from '../../features/categories/categoryApi';
import ArtworkTable from '../../features/artworks/ArtworkTable';
import ArtworkFilter from '../../features/artworks/ArtworkFilter';
import StatusChangeModal from '../../features/artworks/StatusChangeModel';
import SellModal from '../../features/artworks/SellModal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import { isBinStatus } from '../../features/artworks/artworkUtils';

export default function Artworks() {
  const { data: artworks = [], isLoading, isError } = useGetArtworksQuery();
  const { data: artists = [] } = useGetArtistsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    artistId: searchParams.get('artistId') || '',
    status: '',
    condition: '',
    buyerCin: searchParams.get('buyerCin') || '',
    depositorCin: searchParams.get('depositorCin') || '',
  });

  const [statusTarget, setStatusTarget] = useState(null);
  const [sellTarget, setSellTarget] = useState(null);

  useEffect(() => {
    const artistId = searchParams.get('artistId') || '';
    const buyerCin = searchParams.get('buyerCin') || '';
    const depositorCin = searchParams.get('depositorCin') || '';

    setFilters((prev) => ({
      ...prev,
      artistId,
      buyerCin,
      depositorCin,
    }));
  }, [searchParams]);

  const activeArtworks = useMemo(
    () =>
      filters.buyerCin
        ? artworks.filter((a) => a.status === 'sold')
        : artworks.filter((a) => !isBinStatus(a.status)),
    [artworks, filters.buyerCin]
  );

  const filtered = useMemo(() => {
    return activeArtworks.filter((a) => {
      if (
        search &&
        !a.title?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      if (filters.categoryId) {
        const catId = a.categoryId?._id || a.categoryId;

        if (catId !== filters.categoryId) return false;
      }

      if (filters.artistId) {
        const artId = a.artistId?._id || a.artistId;

        if (artId !== filters.artistId) return false;
      }

      if (filters.status && a.status !== filters.status) {
        return false;
      }

      if (filters.condition && a.condition !== filters.condition) {
        return false;
      }

      if (filters.buyerCin && a.buyerCin !== filters.buyerCin) {
        return false;
      }

      if (
        filters.depositorCin &&
        a.depositorCin !== filters.depositorCin
      ) {
        return false;
      }

      return true;
    });
  }, [activeArtworks, search, filters]);

  const {
    page,
    pageSize,
    total,
    paginated,
    setPage,
    setPageSize,
  } = usePagination(filtered, 10);

  const clearActorFilters = () => {
    setFilters((prev) => ({
      ...prev,
      artistId: '',
      buyerCin: '',
      depositorCin: '',
    }));

    setSearchParams({});
  };

  const hasActorFilter =
    filters.artistId ||
    filters.buyerCin ||
    filters.depositorCin;

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md">
        Failed to load artworks.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy-900">
          Artworks
        </h2>

        <Link to="/artworks/new">
          <Button>
            <Plus size={18} />
            Add Artwork
          </Button>
        </Link>
      </div>

      {hasActorFilter && (
        <div className="flex items-center gap-3 bg-navy-50 border border-navy-200 rounded-md px-4 py-2 text-sm text-navy-700">
          <span>Filtered by related actor</span>

          <button
            onClick={clearActorFilters}
            className="text-navy-800 font-medium hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      <div className="bg-white border border-navy-200 rounded-lg p-4 space-y-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ArtworkFilter
          filters={filters}
          onChange={setFilters}
          artists={artists}
          categories={categories}
          statusScope="active"
        />
      </div>

      <ArtworkTable
        artworks={paginated}
        onStatusClick={setStatusTarget}
        onSellClick={setSellTarget}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <StatusChangeModal
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        artwork={statusTarget}
      />

      <SellModal
        open={Boolean(sellTarget)}
        onClose={() => setSellTarget(null)}
        artwork={sellTarget}
      />
    </div>
  );
}