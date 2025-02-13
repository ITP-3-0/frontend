"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuTicketCheck } from "react-icons/lu";

export default function NavBar() {
    return (
        <header className="fixed top-0 z-50 flex items-center justify-between px-10 bg-white/95 shadow-md w-full py-4">
            <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-semibold text-purple-700">HelpDesk</span>
            </Link>

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

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="outline" className="rounded-full">
                        Login
                    </Button>
                </Link>
                <Link href="/help-desk">
                    <Button className="bg-purple-600 hover:bg-purple-700 rounded-full">
                        <LuTicketCheck className="mr-2" />
                        Raise a Ticket
                    </Button>
                </Link>
            </div>
        </header>
    );
}
