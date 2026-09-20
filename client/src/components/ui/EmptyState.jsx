export default function EmptyState({ title = 'No records found', description }) {
  return (
    <div className="text-center py-12 text-navy-500">
      <p className="text-lg font-medium text-navy-700">{title}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  );
}