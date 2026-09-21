import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import {
  useGetArtistsQuery,
  useCreateArtistMutation,
  useUpdateArtistMutation,
} from '../../features/artists/artistApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Artists() {
  const { data: artists = [], isLoading, isError } = useGetArtistsQuery();
  const [createArtist, { isLoading: creating }] = useCreateArtistMutation();
  const [updateArtist, { isLoading: updating }] = useUpdateArtistMutation();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const filtered = useMemo(() => {
    if (!search) return artists;
    const q = search.toLowerCase();
    return artists.filter(
      (a) =>
        a.firstName?.toLowerCase().includes(q) ||
        a.lastName?.toLowerCase().includes(q) ||
        a.cin?.toLowerCase().includes(q)
    );
  }, [artists, search]);

  const {
    page,
    pageSize,
    total,
    paginated,
    setPage,
    setPageSize,
  } = usePagination(filtered, 10);

  const openCreate = () => {
    setEditing(null);
    reset({ firstName: '', lastName: '', cin: '' });
    setModalOpen(true);
  };

  const openEdit = (artist) => {
    setEditing(artist);
    reset({
      firstName: artist.firstName,
      lastName: artist.lastName,
      cin: artist.cin || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateArtist({ id: editing._id, ...data }).unwrap();
      } else {
        await createArtist(data).unwrap();
      }
      setModalOpen(false);
    } catch {
      // ignore
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md">
        Failed to load artists.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy-900">Artists</h2>
        <Button onClick={openCreate}>
          <Plus size={18} /> Add Artist
        </Button>
      </div>

      <Input
        placeholder="Search artists..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No artists found" />
      ) : (
        <>
          <div className="overflow-x-auto border border-navy-200 rounded-lg bg-white">
            <table className="min-w-full divide-y divide-navy-100 text-sm">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy-700">
                    First Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-700">
                    Last Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-700">
                    CIN
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-navy-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {paginated.map((a) => (
                  <tr key={a._id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/artworks?artistId=${a._id}`}
                        className="text-navy-900 hover:underline font-medium"
                      >
                        {a.firstName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/artworks?artistId=${a._id}`}
                        className="text-navy-900 hover:underline"
                      >
                        {a.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{a.cin || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        onClick={() => openEdit(a)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Artist' : 'Add Artist'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="First Name"
            required
            {...register('firstName', { required: 'Required' })}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            required
            {...register('lastName', { required: 'Required' })}
            error={errors.lastName?.message}
          />
          <Input label="CIN (optional)" {...register('cin')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating || updating}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}