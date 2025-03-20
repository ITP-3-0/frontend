"use client";

import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";
import React from "react";

export default function ClientPortal() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !loading) {
        redirect("/login");
    }

    console.log(user);

    const getUsernameFromEmail = (email) => {
        return email.split("@")[0];
    };

    let userName = getUsernameFromEmail(user.email);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to the Client Portal</h1>
            <p>Hello, {userName}</p>
            <p>Your user id is: {user.uid}</p>

            <div style={{ marginTop: "20px" }}>
                <button style={{ padding: "10px 20px", marginRight: "10px", cursor: "pointer" }}>View Tickets</button>
                <button style={{ padding: "10px 20px", cursor: "pointer" }}>Create New Ticket</button>
            </div>
        </div>
    );
}
