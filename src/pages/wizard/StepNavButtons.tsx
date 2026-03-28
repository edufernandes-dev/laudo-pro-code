interface Props {
  onBack?: () => void
  onNext?: () => void
  onSave?: () => void
  saving?: boolean
  nextLabel?: string
  isLast?: boolean
}

export function StepNavButtons({ onBack, onNext, onSave, saving, nextLabel = 'Próximo', isLast = false }: Props) {
  return (
    <div className="flex gap-3 p-4 border-t border-gray-100 bg-white">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-3 font-medium hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
      )}
      <button
        type="button"
        onClick={isLast ? onSave : onNext}
        disabled={saving}
        className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {saving ? 'Salvando...' : isLast ? 'Finalizar' : nextLabel}
      </button>
    </div>
  )
}
