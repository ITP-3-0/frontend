"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuTicketCheck } from "react-icons/lu";
import { FaQuestion } from "react-icons/fa";
import { redirect } from "next/navigation";
import { useAuth } from "@/Firebase/AuthContext";
import NavBar from "./_Components/NavBar";
import { Spinner } from "@/components/ui/spinner";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            <NavBar />
            <div className="flex items-center justify-between px-20 h-full pt-20">
                <div className="flex flex-col gap-4 w-1/2">
                    <h1 className="text-6xl font-bold text-black">Can&apos;t fix your device?</h1>
                    <p className="text-xl text-black">Search FAQs for answers. Still need help? Raise a ticket!</p>
                    <div className="flex gap-4">
                        <Link href="/tickets/create">
                            <Button className="w-fit h-12 bg-blue-500 rounded-full text-white hover:bg-blue-600">
                                <LuTicketCheck className="mr-2" />
                                Raise a Ticket
                            </Button>
                        </Link>
                        <Button className="w-fit h-12 bg-white rounded-full text-blue-600 hover:bg-blue-50 outline">
                            <FaQuestion className="mr-2" />
                            View FAQs
                        </Button>
                    </div>
                </div>
                <div className="w-1/2">
                    <Image src="/women_on_homepage.png" alt="Support" width={900} height={900} className="absolute bottom-0 right-0" />
                    {/* Chat Widget */}
                    <ChatWidget />
                </div>
            </div>
        </div>
    );
}
