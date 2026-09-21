import { useState, useMemo } from 'react';
import { useGetArtworksQuery } from '../../features/artworks/artworkApi';
import { useGetArtistsQuery } from '../../features/artists/artistApi';
import { useGetCategoriesQuery } from '../../features/categories/categoryApi';
import { useChangeArtworkStatusMutation } from '../../features/artworks/artworkApi';
import ArtworkTable from '../../features/artworks/ArtworkTable';
import ArtworkFilter from '../../features/artworks/ArtworkFilter';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import { isBinStatus } from '../../features/artworks/artworkUtils';

export default function Records() {
  const { data: artworks = [], isLoading, isError } = useGetArtworksQuery();
  const { data: artists = [] } = useGetArtistsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [changeStatus, { isLoading: reclaiming }] =
    useChangeArtworkStatusMutation();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    artistId: '',
    status: '',
    condition: '',
  });

  const binArtworks = useMemo(
    () => artworks.filter((a) => isBinStatus(a.status)),
    [artworks]
  );

  const filtered = useMemo(() => {
    return binArtworks.filter((a) => {
      if (search && !a.title?.toLowerCase().includes(search.toLowerCase())) {
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
      if (filters.status && a.status !== filters.status) return false;
      if (filters.condition && a.condition !== filters.condition) return false;
      return true;
    });
  }, [binArtworks, search, filters]);

  const {
    page,
    pageSize,
    total,
    paginated,
    setPage,
    setPageSize,
  } = usePagination(filtered, 10);

  const handleReclaim = async (art) => {
    const nextStatus = art.status === 'sold' ? 'returned' : 'in_storage';
    try {
      await changeStatus({ id: art._id, status: nextStatus }).unwrap();
    } catch {
      // handled by RTK
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md">
        Failed to load records.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">Records</h2>
          <p className="text-sm text-navy-500 mt-0.5">
            Sold and missing artworks. Reclaim to restore them to active
            inventory.
          </p>
        </div>
      </div>

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
          statusScope="bin"
        />
      </div>

      <ArtworkTable
        artworks={paginated}
        showReclaim
        onReclaimClick={handleReclaim}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {reclaiming && (
        <p className="text-sm text-navy-500">Updating status…</p>
      )}
    </div>
  );
}