import { useEffect } from 'react';

export function useScreenFocus(screen: string) {
  useEffect(() => {
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
    document.getElementById('root')?.scrollTo({ top: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen]);
}
