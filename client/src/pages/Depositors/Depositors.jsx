import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import {
  useGetDepositorsQuery,
  useCreateDepositorMutation,
  useUpdateDepositorMutation,
} from '../../features/depositors/depositorApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Depositors() {
  const { data: depositors = [], isLoading, isError } =
    useGetDepositorsQuery();
  const [createDepositor, { isLoading: creating }] =
    useCreateDepositorMutation();
  const [updateDepositor, { isLoading: updating }] =
    useUpdateDepositorMutation();

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
    if (!search) return depositors;
    const q = search.toLowerCase();
    return depositors.filter(
      (d) =>
        d.firstName?.toLowerCase().includes(q) ||
        d.lastName?.toLowerCase().includes(q) ||
        d.cin?.toLowerCase().includes(q)
    );
  }, [depositors, search]);

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

  const openEdit = (depositor) => {
    setEditing(depositor);
    reset({
      firstName: depositor.firstName,
      lastName: depositor.lastName,
      cin: depositor.cin,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateDepositor({ id: editing._id, ...data }).unwrap();
      } else {
        await createDepositor(data).unwrap();
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
        Failed to load depositors.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy-900">Depositors</h2>
        <Button onClick={openCreate}>
          <Plus size={18} /> Add Depositor
        </Button>
      </div>

      <Input
        placeholder="Search depositors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No depositors found" />
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
                {paginated.map((d) => (
                  <tr key={d._id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/artworks?depositorCin=${encodeURIComponent(d.cin)}`}
                        className="text-navy-900 hover:underline font-medium"
                      >
                        {d.firstName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/artworks?depositorCin=${encodeURIComponent(d.cin)}`}
                        className="text-navy-900 hover:underline"
                      >
                        {d.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{d.cin}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        onClick={() => openEdit(d)}
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
        title={editing ? 'Edit Depositor' : 'Add Depositor'}
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
          <Input
            label="CIN"
            required
            {...register('cin', { required: 'CIN is required' })}
            error={errors.cin?.message}
          />
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