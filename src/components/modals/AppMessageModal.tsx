import { AlertTriangle, Check, X } from 'lucide-react';

interface AppMessageModalProps {
  isOpen: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function AppMessageModal({
  isOpen,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose
}: AppMessageModalProps) {
  if (!isOpen) return null;

  const isConfirm = !!cancelLabel;

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center px-4 pb-4 sm:items-center">
      <button
        type="button"
        className="cfc-modal-scrim cursor-default"
        onClick={onClose}
        aria-label={cancelLabel || confirmLabel}
      />
      <div
        className="cfc-dialog-card relative w-full max-w-[360px] overflow-hidden p-5 text-center"
        role="dialog"
        aria-modal="true"
      >
        <div className="cfc-icon-tile mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--cfc-amber),var(--cfc-rose-soft))] text-[#241016]">
          {isConfirm ? <AlertTriangle size={22} /> : <Check size={22} />}
        </div>
        <p className="mx-auto max-w-[290px] text-sm font-bold leading-relaxed text-white/82">
          {message}
        </p>

        <div className="mt-5 flex gap-2">
          {cancelLabel && (
            <button
              type="button"
              className="cfc-action-secondary flex-1"
              onClick={onClose}
            >
              <X size={17} />
              <span className="ml-1.5">{cancelLabel}</span>
            </button>
          )}
          <button
            type="button"
            className="cfc-action-primary flex-1"
            onClick={onConfirm}
          >
            <Check size={17} />
            <span className="ml-1.5">{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
