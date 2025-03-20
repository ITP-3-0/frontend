"use client";

import { createContext, useState, useContext } from "react";

const TabContext = createContext();

export function TabProvider({ children }) {
    const [activeTab, setActiveTab] = useState("user-management");

    return <TabContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabContext.Provider>;
}

export function useTab() {
    return useContext(TabContext);
}
