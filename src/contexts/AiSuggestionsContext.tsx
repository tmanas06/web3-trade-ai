import React, { createContext, useContext, useState } from "react";

const AiSuggestionsContext = createContext({
  aiContent: "",
  setAiContent: (content: string) => {},
});

export const AiSuggestionsProvider = ({ children }) => {
  const [aiContent, setAiContent] = useState("");
  return (
    <AiSuggestionsContext.Provider value={{ aiContent, setAiContent }}>
      {children}
    </AiSuggestionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAiSuggestions = () => useContext(AiSuggestionsContext);
