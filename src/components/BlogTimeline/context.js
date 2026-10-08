import React, {createContext, useContext, useId} from 'react';

const TimelineContext = createContext(null);

export function TimelineProvider({timelines, children}) {
  const panelId = useId();

  return (
    <TimelineContext.Provider value={{timelines, panelId}}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  return useContext(TimelineContext);
}
