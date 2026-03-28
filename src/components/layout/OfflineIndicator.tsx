import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <span>⚡</span>
        <span>Offline — dados salvos localmente</span>
      </div>
    </div>
  )
}
