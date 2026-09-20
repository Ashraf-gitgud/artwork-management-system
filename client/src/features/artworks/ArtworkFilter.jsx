import Select from '../../components/ui/Select';
import { STATUS_OPTIONS, STATUS_LABELS, CONDITION_OPTIONS } from './artworkUtils';

export default function ArtworkFilters({
  filters,
  onChange,
  artists = [],
  categories = [],
}) {
  const handle = (key) => (e) => {
    onChange({ ...filters, [key]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Select
        label="Category"
        value={filters.categoryId || ''}
        onChange={handle('categoryId')}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        label="Artist"
        value={filters.artistId || ''}
        onChange={handle('artistId')}
      >
        <option value="">All artists</option>
        {artists.map((a) => (
          <option key={a._id} value={a._id}>
            {a.firstName} {a.lastName}
          </option>
        ))}
      </Select>

      <Select
        label="Status"
        value={filters.status || ''}
        onChange={handle('status')}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </Select>

      <Select
        label="Condition"
        value={filters.condition || ''}
        onChange={handle('condition')}
      >
        <option value="">All conditions</option>
        {CONDITION_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
    </div>
  );
}