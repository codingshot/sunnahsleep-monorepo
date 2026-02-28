import React, { createContext, useCallback, useContext, useState } from "react";

type PlayerContextValue = {
  visible: boolean;
  title: string | null;
  show: (title?: string) => void;
  hide: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const show = useCallback((t?: string) => {
    setVisible(true);
    setTitle(t ?? null);
  }, []);
  const hide = useCallback(() => {
    setVisible(false);
    setTitle(null);
  }, []);
  return (
    <PlayerContext.Provider value={{ visible, title, show, hide }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  return ctx ?? { visible: false, title: null, show: () => {}, hide: () => {} };
}
