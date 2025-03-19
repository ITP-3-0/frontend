import React from "react";

const ClientPortal = () => {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to the Client Portal</h1>
            <p>Manage your tickets and view updates here.</p>

            <div style={{ marginTop: "20px" }}>
                <button style={{ padding: "10px 20px", marginRight: "10px", cursor: "pointer" }}>View Tickets</button>
                <button style={{ padding: "10px 20px", cursor: "pointer" }}>Create New Ticket</button>
            </div>
        </div>
    );
};

export default ClientPortal;
