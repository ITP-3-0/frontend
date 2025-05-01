export const submitTicket = async (ticketData) => {
    try {
        const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error submitting ticket:", error);
    }
};
