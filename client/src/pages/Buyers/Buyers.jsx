import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil } from 'lucide-react';
import {
  useGetBuyersQuery,
  useCreateBuyerMutation,
  useUpdateBuyerMutation,
} from '../../features/buyer/buyerApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function Buyers() {
  const { data: buyers = [], isLoading, isError } = useGetBuyersQuery();
  const [createBuyer, { isLoading: creating }] = useCreateBuyerMutation();
  const [updateBuyer, { isLoading: updating }] = useUpdateBuyerMutation();

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
    if (!search) return buyers;
    const q = search.toLowerCase();
    return buyers.filter(
      (b) =>
        b.firstName?.toLowerCase().includes(q) ||
        b.lastName?.toLowerCase().includes(q) ||
        b.cin?.toLowerCase().includes(q)
    );
  }, [buyers, search]);

  const openCreate = () => {
    setEditing(null);
    reset({ firstName: '', lastName: '', cin: '' });
    setModalOpen(true);
  };

  const openEdit = (buyer) => {
    setEditing(buyer);
    reset({
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      cin: buyer.cin,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateBuyer({ id: editing._id, ...data }).unwrap();
      } else {
        await createBuyer(data).unwrap();
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
        Failed to load buyers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy-900">Buyers</h2>
        <Button onClick={openCreate}>
          <Plus size={18} /> Add Buyer
        </Button>
      </div>

      <Input
        placeholder="Search buyers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No buyers found" />
      ) : (
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
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-3 text-navy-900">{b.firstName}</td>
                  <td className="px-4 py-3 text-navy-900">{b.lastName}</td>
                  <td className="px-4 py-3 text-navy-700">{b.cin}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      className="!px-2 !py-1.5"
                      onClick={() => openEdit(b)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Buyer' : 'Add Buyer'}
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