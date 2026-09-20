export default function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white border border-navy-200 rounded-lg shadow-sm ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-navy-100">
          <h3 className="font-semibold text-navy-900">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}