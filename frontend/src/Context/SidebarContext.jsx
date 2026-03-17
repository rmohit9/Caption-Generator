import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [sidebarState, setSidebarState] = useState('full'); // 'full' | 'mini' | 'closed'

  return (
    <SidebarContext.Provider value={{ sidebarState, setSidebarState }}>
      {children}
    </SidebarContext.Provider>
  );
};