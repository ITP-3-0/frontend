import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const TicketList = () => {
    const handleGenerateReport = async () => {
        try {
            window.open('/api/replies/generate-report', '_blank');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate report",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Button 
                    onClick={handleGenerateReport}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Generate Report
                </Button>
            </div>
        </div>
    );
};

export default TicketList;