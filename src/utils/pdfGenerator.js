import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTicketReport = (tickets) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Help Desk Ticket Report', 15, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 25);

    // Prepare table data including replies with full content
    const headers = [['ID', 'Title', 'Status', 'Priority', 'Created By', 'Description', 'Reply Content']];
    const data = tickets.map(ticket => [
        String(ticket._id).substring(0, 6),
        String(ticket.title),
        String(ticket.status),
        String(ticket.priority),
        String(ticket.creator),
        String(ticket.description),
        ticket.replies && ticket.replies.length > 0 
            ? ticket.replies.map(reply => 
                `Reply from ${reply.agentName || 'Agent'}:\n${reply.content}\n(${new Date(reply.created_at).toLocaleDateString()})`
              ).join('\n\n')
            : 'No replies'
    ]);

    // Generate table with updated styles for reply content
    autoTable(doc, {
        head: headers,
        body: data,
        startY: 35,
        theme: 'grid',
        styles: { 
            fontSize: 8,
            cellPadding: 5,
            overflow: 'linebreak',
            halign: 'left',
            valign: 'top',
            lineWidth: 0.5
        },
        headStyles: { 
            fillColor: [71, 85, 105],
            fontSize: 9,
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 15 }, // ID
            1: { cellWidth: 25 }, // Title
            2: { cellWidth: 20 }, // Status
            3: { cellWidth: 20 }, // Priority
            4: { cellWidth: 25 }, // Created By
            5: { cellWidth: 35 }, // Description
            6: { cellWidth: 50, minCellHeight: 30 }  // Reply Content
        }
    });

    return doc;
};
