import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (data, type, chartRef) => {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(88, 28, 135); // Purple color
    pdf.text("SchoolDesk Report", margin, margin);

    // Add timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, margin + 10);

    // Add title based on type
    pdf.setFontSize(16);
    pdf.setTextColor(0);
    const title = type === 'status' ? 'Tickets by Status' : 'Issue Types Distribution';
    pdf.text(title, margin, margin + 25);

    // If chart reference is provided, add chart image
    if (chartRef && chartRef.current) {
        try {
            const canvas = await html2canvas(chartRef.current);
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (2 * margin);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', margin, margin + 30, imgWidth, imgHeight);
            
            // Move cursor below image
            let y = margin + 35 + imgHeight;
            
            // Add data below chart
            pdf.setFontSize(12);
            if (type === 'status') {
                data.forEach((item) => {
                    pdf.text(`${item.name}: ${item.value}%`, margin, y);
                    y += 8;
                });
            } else {
                data.forEach((item) => {
                    pdf.text(`${item.name}:`, margin, y);
                    pdf.text(`This Week: ${item.thisWeek}`, margin + 20, y + 8);
                    pdf.text(`This Month: ${item.thisMonth}`, margin + 20, y + 16);
                    y += 24;
                });
            }
        } catch (error) {
            console.error('Error generating chart image:', error);
        }
    }

    // Add footer
    const footerText = "© SchoolDesk Help Desk System";
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    const footerWidth = pdf.getStringUnitWidth(footerText) * 10 / pdf.internal.scaleFactor;
    pdf.text(footerText, (pageWidth - footerWidth) / 2, pdf.internal.pageSize.getHeight() - 10);

    // Save the PDF
    pdf.save(`schooldesk_report_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
}; 