import React, { useState, useMemo } from "react";

export const ViewContext = React.createContext();

const ViewProvider = ({ children }) => {
  const [view, setView] = useState("daily");

  const value = useMemo(() => ({ view, setView }), [view]);

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export default ViewProvider;
