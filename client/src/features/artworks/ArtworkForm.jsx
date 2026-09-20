import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { CONDITION_OPTIONS, UNIT_OPTIONS } from './artworkUtils';
import { useGetArtistsQuery } from '../artists/artistApi';
import { useGetCategoriesQuery } from '../categories/categoryApi';
import { useGetDepositorsQuery } from '../depositors/depositorApi';

export default function ArtworkForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save',
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      imageUrl: '',
      condition: 'Good',
      artistId: '',
      categoryId: '',
      creationDate: '',
      medium: '',
      technique: '',
      material: '',
      signatureLocation: '',
      creationCertificate: false,
      height: '',
      width: '',
      depth: '',
      unit: 'cm',
      depositorCin: '',
      notes: '',
      ...defaultValues,
    },
  });

  const { data: artists = [] } = useGetArtistsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: depositors = [] } = useGetDepositorsQuery();

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title || '',
        imageUrl: defaultValues.imageUrl || '',
        condition: defaultValues.condition || 'Good',
        artistId: defaultValues.artistId?._id || defaultValues.artistId || '',
        categoryId: defaultValues.categoryId?._id || defaultValues.categoryId || '',
        creationDate: defaultValues.creationDate
          ? defaultValues.creationDate.slice(0, 10)
          : '',
        medium: defaultValues.medium || '',
        technique: defaultValues.technique || '',
        material: defaultValues.material || '',
        signatureLocation: defaultValues.signatureLocation || '',
        creationCertificate: defaultValues.creationCertificate || false,
        height: defaultValues.dimensions?.height ?? '',
        width: defaultValues.dimensions?.width ?? '',
        depth: defaultValues.dimensions?.depth ?? '',
        unit: defaultValues.dimensions?.unit || 'cm',
        depositorCin: defaultValues.depositorCin || '',
        notes: defaultValues.notes || '',
      });
    }
  }, [defaultValues, reset]);

  const submit = (data) => {
    const payload = {
      title: data.title,
      imageUrl: data.imageUrl || undefined,
      condition: data.condition,
      artistId: data.artistId || undefined,
      categoryId: data.categoryId,
      creationDate: data.creationDate,
      medium: data.medium,
      technique: data.technique || undefined,
      material: data.material || undefined,
      signatureLocation: data.signatureLocation || undefined,
      creationCertificate: Boolean(data.creationCertificate),
      dimensions: {
        height: Number(data.height),
        width: Number(data.width),
        depth: data.depth ? Number(data.depth) : undefined,
        unit: data.unit,
      },
      depositorCin: data.depositorCin,
      notes: data.notes || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8">
      {/* Basic */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            required
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <Input
            label="Image URL"
            {...register('imageUrl')}
            placeholder="https://..."
          />
          <Select
            label="Condition"
            required
            {...register('condition', { required: 'Condition is required' })}
            error={errors.condition?.message}
          >
            {CONDITION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Classification */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Artist" {...register('artistId')}>
            <option value="">— None —</option>
            {artists.map((a) => (
              <option key={a._id} value={a._id}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </Select>
          <Select
            label="Category"
            required
            {...register('categoryId', { required: 'Category is required' })}
            error={errors.categoryId?.message}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Creation */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Creation Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Creation Date"
            type="date"
            required
            {...register('creationDate', { required: 'Creation date is required' })}
            error={errors.creationDate?.message}
          />
          <Input
            label="Medium"
            required
            {...register('medium', { required: 'Medium is required' })}
            error={errors.medium?.message}
          />
          <Input label="Technique" {...register('technique')} />
          <Input label="Material" {...register('material')} />
          <Input label="Signature Location" {...register('signatureLocation')} />
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="creationCertificate"
              {...register('creationCertificate')}
              className="h-4 w-4 rounded border-navy-300 text-navy-700 focus:ring-navy-500"
            />
            <label htmlFor="creationCertificate" className="text-sm text-navy-700">
              Has creation certificate
            </label>
          </div>
        </div>
      </section>

      {/* Physical */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Physical Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Height"
            type="number"
            step="any"
            required
            {...register('height', { required: 'Height is required' })}
            error={errors.height?.message}
          />
          <Input
            label="Width"
            type="number"
            step="any"
            required
            {...register('width', { required: 'Width is required' })}
            error={errors.width?.message}
          />
          <Input label="Depth" type="number" step="any" {...register('depth')} />
          <Select
            label="Unit"
            required
            {...register('unit', { required: true })}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Inventory */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Inventory
        </h3>
        <Select
          label="Depositor"
          required
          {...register('depositorCin', { required: 'Depositor is required' })}
          error={errors.depositorCin?.message}
        >
          <option value="">Select depositor</option>
          {depositors.map((d) => (
            <option key={d._id} value={d.cin}>
              {d.firstName} {d.lastName} ({d.cin})
            </option>
          ))}
        </Select>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-navy-900 border-b border-navy-100 pb-2">
          Notes
        </h3>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          placeholder="Optional notes..."
        />
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}