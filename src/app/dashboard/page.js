import React from "react";

const Dashboard = () => {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Dashboard</h1>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h2>Tickets Overview</h2>
                    <p>Total Tickets: 120</p>
                    <p>Open Tickets: 45</p>
                    <p>Closed Tickets: 75</p>
                </div>
                <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h2>Recent Activity</h2>
                    <ul>
                        <li>Ticket #123 updated by John</li>
                        <li>Ticket #124 closed by Sarah</li>
                        <li>New ticket #125 created by Mike</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
