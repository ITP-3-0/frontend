"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuTicketCheck } from "react-icons/lu";

export default function NavBar(params) {
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
                <Link className="text-black hover:underline" href="/replies">
                    Forum
                </Link>
                <Link className="text-black hover:underline" href="/faqs">
                    FAQs
                </Link>
            </nav>

            <div onClick={() => (window.location.href = "/login")}>
                <Button className="w-fit bg-blue-500 rounded-full text-white hover:bg-blue-600">
                    <LuTicketCheck />
                    Get Started
                </Button>
            </div>
        </header>
    );
}
