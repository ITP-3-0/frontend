import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuTicketCheck } from "react-icons/lu";
import { FaQuestion } from "react-icons/fa";

export default function Home() {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            <div className="flex items-center justify-between px-20 h-full pt-20">
                <div className="flex flex-col gap-4 w-1/2">
                    <h1 className="text-6xl font-bold text-black">Can&apos;t fix your device?</h1>
                    <p className="text-xl text-black">Search FAQs for answers. Still need help? Raise a ticket!</p>
                    <div className="flex gap-4">
                        <Button className="w-fit h-12 bg-blue-500 rounded-full text-white hover:bg-blue-600">
                            <LuTicketCheck />
                            Raise a Ticket
                        </Button>
                        <Button className="w-fit h-12 bg-white rounded-full text-blue-600 hover:bg-blue-50 outline">
                            <FaQuestion />
                            View FAQs
                        </Button>
                    </div>
                </div>
                <div className="w-1/2">
                    <Image src="/women_on_homepage.png" alt="Support" width={900} height={900} className="absolute bottom-0 right-0" />
                </div>
            </div>
        </div>
    );
}
