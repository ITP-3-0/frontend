"use client";

import { useState, createContext, useContext } from "react";

const ButtonContext = createContext();

export const ButtonProvider = ({ children }) => {
    const [button, setButton] = useState(false);

    return <ButtonContext.Provider value={{ button, setButton }}>{children}</ButtonContext.Provider>;
};

export const useButton = () => useContext(ButtonContext);
