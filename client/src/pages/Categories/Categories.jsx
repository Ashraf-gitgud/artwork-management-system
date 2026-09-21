import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil } from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '../../features/categories/categoryApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Categories() {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

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
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [categories, search]);

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
    reset({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    reset({
      name: category.name,
      description: category.description || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateCategory({ id: editing._id, ...data }).unwrap();
      } else {
        await createCategory(data).unwrap();
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
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy-900">Categories</h2>
        <Button onClick={openCreate}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <Input
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No categories found" />
      ) : (
        <>
          <div className="overflow-x-auto border border-navy-200 rounded-lg bg-white">
            <table className="min-w-full divide-y divide-navy-100 text-sm">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-navy-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-navy-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {paginated.map((c) => (
                  <tr key={c._id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3 font-medium text-navy-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-navy-700">
                      {c.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        className="!px-2 !py-1.5"
                        onClick={() => openEdit(c)}
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
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            required
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-navy-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
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