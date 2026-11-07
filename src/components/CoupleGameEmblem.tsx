export type CoupleGameMode = 'after-hours' | 'heart-dice' | 'sketch-date' | 'date-mystery';

type CoupleGameEmblemProps = {
  mode: CoupleGameMode;
  className?: string;
};

const heart = 'M48 69c-2-2-17-12-17-22 0-6 4-10 10-10 4 0 7 2 7 6 1-4 4-6 8-6 6 0 10 4 10 10 0 10-15 20-17 22Z';

// Each emblem pairs the game's mechanic with a couple cue; the mystery art stays clue-neutral.
export function CoupleGameEmblem({ mode, className = '' }: CoupleGameEmblemProps) {
  return <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="94" height="94" rx="24" fill="#2D1929" stroke="#A86C80" strokeWidth="2" />
    <circle cx="77" cy="19" r="23" fill="#FF6F9A" opacity=".12" />
    {mode === 'after-hours' && <>
      <circle cx="31" cy="36" r="11" fill="#FFD1DF" />
      <circle cx="65" cy="36" r="11" fill="#F8D38A" />
      <path d="M13 74c1-14 8-22 20-22 8 0 14 4 17 11M83 74c-1-14-8-22-20-22-8 0-14 4-17 11" stroke="#FFD1DF" strokeWidth="7" strokeLinecap="round" />
      <path d="M48 69c-2-2-11-8-11-14 0-3 2-5 5-5 3 0 5 2 6 4 1-2 3-4 6-4 3 0 5 2 5 5 0 6-9 12-11 14Z" fill="#FF6F9A" stroke="#2D1929" strokeWidth="2" />
      <path d="m48 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#F8D38A" />
    </>}
    {mode === 'heart-dice' && <>
      <g transform="rotate(-13 33 55)"><rect x="12" y="34" width="43" height="43" rx="10" fill="#FF9CBC" stroke="#FFD1DF" strokeWidth="2" /><path d="M33.5 65c-2-2-10-8-10-13 0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 5-8 11-10 13Z" fill="#71354F" /></g>
      <g transform="rotate(12 64 41)"><rect x="43" y="20" width="42" height="42" rx="10" fill="#F8D38A" stroke="#FFF0CF" strokeWidth="2" /><circle cx="57" cy="34" r="4" fill="#71354F" /><circle cx="70" cy="48" r="4" fill="#71354F" /><path d="M64 34c0-2 2-3 3-1 1-2 3-1 3 1 0 2-3 4-3 4s-3-2-3-4Z" fill="#FF6F9A" /></g>
      <path d="m77 72 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#FF6F9A" />
    </>}
    {mode === 'sketch-date' && <>
      <g transform="rotate(-7 47 48)"><rect x="18" y="18" width="57" height="61" rx="8" fill="#FFF0E3" stroke="#F8D38A" strokeWidth="2" /><path d="M28 30h18M28 36h13" stroke="#C9AFA8" strokeWidth="2" strokeLinecap="round" /><path d={heart} transform="translate(-5 -6) scale(.85)" fill="#FF8EAD" stroke="#A85B76" strokeWidth="2" /></g>
      <g transform="rotate(27 73 55)"><rect x="70" y="34" width="8" height="37" rx="2" fill="#F8D38A" stroke="#71354F" strokeWidth="2" /><path d="m70 70 4 10 4-10" fill="#FFF0E3" stroke="#71354F" strokeWidth="2" strokeLinejoin="round" /><path d="M70 40h8" stroke="#71354F" strokeWidth="2" /></g>
      <circle cx="21" cy="75" r="3" fill="#FF6F9A" />
    </>}
    {mode === 'date-mystery' && <>
      <g transform="rotate(-10 35 43)"><rect x="14" y="24" width="48" height="40" rx="7" fill="#F8D38A" stroke="#FFF0CF" strokeWidth="2" /><path d="m17 29 21 17 21-17" stroke="#8A4F62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g transform="rotate(9 60 52)"><rect x="38" y="36" width="45" height="35" rx="7" fill="#FFD1DF" stroke="#FFF0E3" strokeWidth="2" /><path d="m41 41 20 15 19-15" stroke="#A85B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
      <path d="M49 55c-1-1-5-4-5-7 0-2 1-3 3-3 1 0 2 1 2 2 1-1 2-2 3-2 2 0 3 1 3 3 0 3-5 6-6 7Z" fill="#FF6F9A" />
      <circle cx="68" cy="70" r="11" fill="#2D1929" stroke="#F8D38A" strokeWidth="4" /><path d="m76 78 8 8" stroke="#F8D38A" strokeWidth="5" strokeLinecap="round" />
    </>}
  </svg>;
}
