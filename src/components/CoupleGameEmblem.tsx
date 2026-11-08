export type CoupleGameMode = 'after-hours' | 'heart-dice' | 'sketch-date' | 'date-mystery';

type CoupleGameEmblemProps = {
  mode: CoupleGameMode;
  className?: string;
};

const heart = 'M48 69c-2-2-17-12-17-22 0-6 4-10 10-10 4 0 7 2 7 6 1-4 4-6 8-6 6 0 10 4 10 10 0 10-15 20-17 22Z';

// Each emblem pairs the game's mechanic with a couple cue; the mystery art stays clue-neutral.
export function CoupleGameEmblem({ mode, className = '' }: CoupleGameEmblemProps) {
  return <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#280C27" stroke="#FF3B94" strokeWidth="2" />
    <circle cx="77" cy="19" r="23" fill="#FF3B94" opacity=".12" />
    {mode === 'after-hours' && <>
      <circle cx="31" cy="36" r="11" fill="#FFB5DC" />
      <circle cx="65" cy="36" r="11" fill="#B88AFF" />
      <path d="M13 74c1-14 8-22 20-22 8 0 14 4 17 11M83 74c-1-14-8-22-20-22-8 0-14 4-17 11" stroke="#FFB5DC" strokeWidth="7" strokeLinecap="round" />
      <path d="M48 69c-2-2-11-8-11-14 0-3 2-5 5-5 3 0 5 2 6 4 1-2 3-4 6-4 3 0 5 2 5 5 0 6-9 12-11 14Z" fill="#FF3B94" stroke="#280C27" strokeWidth="2" />
      <path d="m48 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#B88AFF" />
    </>}
    {mode === 'heart-dice' && <>
      <g transform="rotate(-13 33 55)"><rect x="12" y="34" width="43" height="43" rx="10" fill="#FF73B9" stroke="#FFB5DC" strokeWidth="2" /><path d="M33.5 65c-2-2-10-8-10-13 0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 5-8 11-10 13Z" fill="#3A0C32" /></g>
      <g transform="rotate(12 64 41)"><rect x="43" y="20" width="42" height="42" rx="10" fill="#B88AFF" stroke="#E8D3FF" strokeWidth="2" /><circle cx="57" cy="34" r="4" fill="#3A0C32" /><circle cx="70" cy="48" r="4" fill="#3A0C32" /><path d="M64 34c0-2 2-3 3-1 1-2 3-1 3 1 0 2-3 4-3 4s-3-2-3-4Z" fill="#FF3B94" /></g>
      <path d="m77 72 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#FF3B94" />
    </>}
    {mode === 'sketch-date' && <>
      <g transform="rotate(-7 47 48)"><rect x="18" y="18" width="57" height="61" rx="8" fill="#F8DBF1" stroke="#B88AFF" strokeWidth="2" /><path d="M28 30h18M28 36h13" stroke="#9C72A5" strokeWidth="2" strokeLinecap="round" /><path d={heart} transform="translate(-5 -6) scale(.85)" fill="#FF53A5" stroke="#B71E77" strokeWidth="2" /></g>
      <g transform="rotate(27 73 55)"><rect x="70" y="34" width="8" height="37" rx="2" fill="#B88AFF" stroke="#3A0C32" strokeWidth="2" /><path d="m70 70 4 10 4-10" fill="#F8DBF1" stroke="#3A0C32" strokeWidth="2" strokeLinejoin="round" /><path d="M70 40h8" stroke="#3A0C32" strokeWidth="2" /></g>
      <circle cx="21" cy="75" r="3" fill="#FF3B94" />
    </>}
    {mode === 'date-mystery' && <>
      <g transform="rotate(-10 35 43)"><rect x="14" y="24" width="48" height="40" rx="7" fill="#B88AFF" stroke="#E8D3FF" strokeWidth="2" /><path d="m17 29 21 17 21-17" stroke="#662557" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g transform="rotate(9 60 52)"><rect x="38" y="36" width="45" height="35" rx="7" fill="#FFB5DC" stroke="#F8DBF1" strokeWidth="2" /><path d="m41 41 20 15 19-15" stroke="#B71E77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
      <path d="M49 55c-1-1-5-4-5-7 0-2 1-3 3-3 1 0 2 1 2 2 1-1 2-2 3-2 2 0 3 1 3 3 0 3-5 6-6 7Z" fill="#FF3B94" />
      <circle cx="68" cy="70" r="11" fill="#280C27" stroke="#B88AFF" strokeWidth="4" /><path d="m76 78 8 8" stroke="#B88AFF" strokeWidth="5" strokeLinecap="round" />
    </>}
  </svg>;
}
