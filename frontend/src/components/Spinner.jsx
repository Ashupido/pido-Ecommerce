export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/80 px-5 py-4 text-gray-200 shadow-xl shadow-black/20">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-blue-400" />
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}
