import React, { createContext, useContext, useState } from "react";

// Create Context
const MoodContext = createContext();

// Mood Provider Component
export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState([]); // Array to hold mood states

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
};

// Custom Hook to Use Mood Context
export const useMood = () => {
  return useContext(MoodContext);
};