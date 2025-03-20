"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuTicketCheck } from "react-icons/lu";

export default function NavBar() {
    return (
        <header className="fixed top-0 flex items-center justify-between px-10 border-b-0 border-slate-400 shadow-md w-full py-4">
            <button
                onClick={() => {
                    window.location.href = "/";
                }}
                className="flex items-center gap-2"
            >
                <span className="text-xl font-semibold text-blue-700">HelpDesk</span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
                <Link className="text-black hover:underline" href="/">
                    Home
                </Link>
                <Link className="text-black hover:underline" href="/help-desk">
                    Help Desk
                </Link>
                <Link className="text-black hover:underline" href="/forum">
                    Forum
                </Link>
                <Link className="text-black hover:underline" href="/faqs">
                    FAQs
                </Link>
            </nav>

            <Link href="/tickets/ticketList">
                <Button className="w-fit bg-blue-500 rounded-full text-white hover:bg-blue-600 flex items-center gap-2">
                    <LuTicketCheck />
                    View All Tickets
                </Button>
            </Link>
        </header>
    );
}
