import { Crown, Sparkles, Ticket, X } from 'lucide-react';
import { Translation } from '../../i18n';

interface PremiumPreviewModalProps {
  isOpen: boolean;
  copy: Translation;
  onClose: () => void;
}

export function PremiumPreviewModal({ isOpen, copy, onClose }: PremiumPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[135] flex items-end justify-center px-4 pb-4 sm:items-center">
      <div className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] border border-amber-100/22 bg-[#140c13] shadow-2xl">
        <img
          src="/assets/pose-blindbox.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-34"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,19,0.34),rgba(20,12,19,0.92)_34%,rgba(20,12,19,0.98))]" />

        <div className="relative z-10 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-100/24 bg-amber-100/12 px-3 py-1 text-[11px] font-black text-amber-100">
              <Sparkles size={13} />
              {copy.premium.badge}
            </div>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white/76 active:scale-95"
              onClick={onClose}
              aria-label={copy.premium.close}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-[#2c1006]">
              <Crown size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight text-white">{copy.premium.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/62">
                {copy.premium.subtitle}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-[22px] border border-white/12 bg-white/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase text-white/44">Tonight Pass</div>
                <div className="mt-1 text-2xl font-black text-white">{copy.premium.price}</div>
              </div>
              <Ticket className="text-rose-100" size={28} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/58">{copy.premium.plan}</p>
          </div>

          <div className="space-y-2">
            {copy.premium.features.map(feature => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-black/18 px-3 py-2 text-sm font-semibold leading-relaxed text-white/76"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[20px] border border-rose-100/16 bg-rose-100/10 p-3">
            <div className="text-sm font-black text-rose-100">{copy.premium.secondaryPrice}</div>
            <p className="mt-1 text-xs leading-relaxed text-white/58">{copy.premium.secondaryPlan}</p>
          </div>

          <button
            type="button"
            className="mt-5 h-12 w-full rounded-2xl bg-white text-sm font-black text-[#16090f] transition active:scale-[0.98]"
            onClick={onClose}
          >
            {copy.premium.close}
          </button>
        </div>
      </div>
    </div>
  );
}
