import { useStore } from '../context/StoreContext'

// Transient confirmation messages (add-to-bag, logged out, etc).
export default function ToastStack() {
  const { toasts } = useStore()
  if (!toasts.length) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto border border-ink bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg-primary shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
