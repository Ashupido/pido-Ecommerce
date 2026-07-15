import Toast from './Toast';

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed right-3 top-3 z-[60] w-[calc(100%-1.5rem)] max-w-sm space-y-2 pointer-events-auto sm:right-4 sm:top-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
