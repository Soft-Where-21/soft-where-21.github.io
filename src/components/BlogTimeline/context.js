import React, {createContext, useContext, useId, useState} from 'react';

const TimelineContext = createContext(null);

export function TimelineProvider({timelines, children}) {
  const [activeId, setActiveId] = useState(timelines[0]?.id);
  const panelId = useId();
  const activeTimeline = timelines.find((timeline) => timeline.id === activeId) ?? timelines[0];

  return (
    <TimelineContext.Provider value={{timelines, activeTimeline, setActiveId, panelId}}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  return useContext(TimelineContext);
}
