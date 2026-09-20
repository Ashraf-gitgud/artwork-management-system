import { STATUS_LABELS } from './artworkUtils';

const colorMap = {
  for_sale: 'bg-emerald-100 text-emerald-800',
  for_auction: 'bg-amber-100 text-amber-800',
  for_exhibit: 'bg-sky-100 text-sky-800',
  in_storage: 'bg-navy-100 text-navy-800',
  being_restored: 'bg-orange-100 text-orange-800',
  sold: 'bg-purple-100 text-purple-800',
  returned: 'bg-slate-100 text-slate-700',
  missing: 'bg-red-100 text-red-800',
};

export default function ArtworkStatus({ status }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colorMap[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}