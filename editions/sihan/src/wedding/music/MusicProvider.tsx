import { createContext, ReactNode, useContext } from 'react';
import { useInvitationMusic } from './useInvitationMusic';

const MusicContext = createContext<ReturnType<typeof useInvitationMusic> | null>(null);

/** One silently prepared player, shared by the seal and the revealed controls. */
export function MusicProvider({ children }: { children: ReactNode }) {
  const music = useInvitationMusic();
  return <MusicContext.Provider value={music}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const music = useContext(MusicContext);
  if (!music) throw new Error('MusicProvider is required');
  return music;
}