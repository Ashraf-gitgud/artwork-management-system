import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGetArtworksQuery } from '../../features/artworks/artworkApi';
import { useGetArtistsQuery } from '../../features/artists/artistApi';
import { useGetCategoriesQuery } from '../../features/categories/categoryApi';
import ArtworkTable from '../../features/artworks/ArtworkTable';
import ArtworkFilters from '../../features/artworks/ArtworkFilter';
import StatusChangeModel from '../../features/artworks/StatusChangeModel';
import SellModal from '../../features/artworks/SellModal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';

export default function Artworks() {
  const { data: artworks = [], isLoading, isError } = useGetArtworksQuery();
  const { data: artists = [] } = useGetArtistsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    artistId: '',
    status: '',
    condition: '',
  });
  const [statusTarget, setStatusTarget] = useState(null);
  const [sellTarget, setSellTarget] = useState(null);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
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
  }, [artworks, search, filters]);

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
        <h2 className="text-xl font-semibold text-navy-900">Artworks</h2>
        <Link to="/artworks/new">
          <Button>
            <Plus size={18} />
            Add Artwork
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-navy-200 rounded-lg p-4 space-y-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ArtworkFilters
          filters={filters}
          onChange={setFilters}
          artists={artists}
          categories={categories}
        />
      </div>

      <ArtworkTable
        artworks={filtered}
        onStatusClick={setStatusTarget}
        onSellClick={setSellTarget}
      />

      <StatusChangeModel
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