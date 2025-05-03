import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate a PDF report of tickets
 * @param {Array} tickets - Array of ticket objects
 * @param {Function} getWarrantyStatus - Function to calculate warranty status
 * @returns {void} - Opens PDF in new window
 */
export function generatePdfReport(tickets, getWarrantyStatus) {
    // Initialize PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(100, 58, 237); // Purple color
    doc.text('Ticket Management Report', 105, 15, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

    // Add summary
    const activeTickets = tickets.filter(ticket => getWarrantyStatus(ticket).isActive).length;
    const expiredTickets = tickets.length - activeTickets;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Tickets: ${tickets.length}`, 20, 30);
    doc.setTextColor(40, 167, 69);
    doc.text(`Active Warranty: ${activeTickets}`, 80, 30);
    doc.setTextColor(220, 53, 69);
    doc.text(`Expired Warranty: ${expiredTickets}`, 150, 30);

    // Prepare table data
    const tableColumn = ["ID", "Title", "Device", "Distribution Date", "Warranty Status", "Status"];
    const tableRows = [];

    tickets.forEach(ticket => {
        const warrantyStatus = getWarrantyStatus(ticket);
        const warrantyText = warrantyStatus.isActive ?
            `Active (${warrantyStatus.diffDays} days left)` :
            `Expired (${warrantyStatus.diffDays} days ago)`;

        const rowData = [
            ticket._id.slice(0, 10) + '...',
            ticket.title.length > 25 ? ticket.title.substring(0, 25) + '...' : ticket.title,
            ticket.deviceName || 'N/A',
            new Date(ticket.distributionDate).toLocaleDateString(),
            warrantyText,
            ticket.status,
            // Add the first reply content if available, limited to 30 characters
            ticket.replies && Array.isArray(ticket.replies) && ticket.replies.length > 0 && ticket.replies[0]?.content
                ? (ticket.replies[0].content.length > 30
                    ? ticket.replies[0].content.substring(0, 30) + '...'
                    : ticket.replies[0].content)
                : 'No replies'
        ];
        tableRows.push(rowData);
    });

    // Generate table - using the imported autoTable function with doc as parameter
    autoTable(doc, {
        head: [tableColumn.concat(["Reply Msg"])], // Add Reply Msg column to headers
        body: tableRows,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 25 },  // Reduced width to accommodate new column
            1: { cellWidth: 35 },  // Reduced width to accommodate new column
            6: { cellWidth: 40 }   // Width for the new Reply Msg column
        },
        headStyles: {
            fillColor: [124, 58, 237],
            textColor: [255, 255, 255]
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell: function (data) {
            // Add color based on warranty status
            if (data.column.index === 4 && data.cell.raw.includes('Active')) {
                data.cell.styles.textColor = [40, 167, 69];
            } else if (data.column.index === 4 && data.cell.raw.includes('Expired')) {
                data.cell.styles.textColor = [220, 53, 69];
            }
        }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            'Ticket Management System',
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
        );
    }

    // Save and open PDF
    doc.save(`ticket-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
