// contexts/SuggestionContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface SuggestionContextType {
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
}

const SuggestionContext = createContext<SuggestionContextType>({
  suggestions: [],
  setSuggestions: () => {},
});

export const SuggestionProvider = ({ children }: { children: React.ReactNode }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  return (
    <SuggestionContext.Provider value={{ suggestions, setSuggestions }}>
      {children}
    </SuggestionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSuggestions = () => useContext(SuggestionContext);
