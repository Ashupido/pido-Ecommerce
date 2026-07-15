export default function Toast({ id, message, type, onRemove }) {
  const styles = {
    success: 'border-emerald-500/40 bg-emerald-950 text-emerald-50',
    error: 'border-red-500/40 bg-red-950 text-red-50',
    warning: 'border-amber-500/40 bg-amber-950 text-amber-50',
    info: 'border-blue-500/40 bg-blue-950 text-blue-50',
  }[type] || 'border-gray-600 bg-gray-900 text-gray-50';

  const icon = {
    success: 'OK',
    error: '!',
    warning: '!',
    info: 'i',
  }[type];

  return (
    <div
      className={`${styles} flex w-full items-start justify-between gap-4 rounded-lg border px-4 py-3 shadow-2xl shadow-black/30`}
      role="status"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-black">
          {icon}
        </span>
        <span className="text-sm font-medium leading-5">{message}</span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="rounded p-1 text-sm font-bold opacity-70 transition hover:bg-white/10 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        x
      </button>
    </div>
  );
}
