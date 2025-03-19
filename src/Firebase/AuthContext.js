"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { auth } from "./Initialize";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setLoading(true);
            if (user) {
                console.log("User is logged in");
                setUser(user);
                setLoading(false);
            } else {
                console.log("User is logged out");
                setUser(null);
                setLoading(false);
            }
        });
    }, []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
