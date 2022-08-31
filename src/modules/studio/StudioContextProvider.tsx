import React, { createContext, useContext, useMemo, useState } from 'react';

type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];

interface Context {
  StyleSheetOpen: State<boolean>;
  ActiveDivId: State<string | null>;
  ActiveDivIds: State<string[] | []>;
}

const StudioContext = createContext<Context | undefined>(undefined);
export const useStudioContext = () => useContext(StudioContext) as Context;

export default function StudioContextProvider({ children }: { children: React.ReactNode }) {
  const [styleSheetOpen, setStyleSheetOpen] = useState(false) as Context['StyleSheetOpen'];
  const [activeId, setActiveId] = useState(null) as Context['ActiveDivId'];
  const [activeIds, setActiveIds] = useState([]) as Context['ActiveDivIds'];
  const value: Context = useMemo(
    () => ({
      StyleSheetOpen: [styleSheetOpen, setStyleSheetOpen],
      ActiveDivId: [activeId, setActiveId],
      ActiveDivIds: [activeIds, setActiveIds],
    }),
    [styleSheetOpen, activeId, activeIds],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
