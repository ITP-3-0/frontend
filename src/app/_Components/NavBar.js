"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LuTicketCheck, LuMenu, LuX, LuLogIn, LuLogOut, LuBell } from "react-icons/lu";
import { FaHeadset } from "react-icons/fa";
import { useAuth } from "@/Firebase/AuthContext";
import { logout } from "@/Firebase/FirebaseFunctions";
import axios from "axios";

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user, loading } = useAuth();
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // Check for notifications when user is available
        if (user) {
            checkNotifications();
        }
    }, [user]);

    const checkNotifications = async () => {
        try {
            // Mock checking for notifications - replace with your actual API call
            // For example: const response = await axios.get('/api/notifications/check');
            // For now, just set to true to test the UI
            setHasNotifications(true);
        } catch (error) {
            console.error("Error checking notifications:", error);
        }
    };

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all">
                            <FaHeadset className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                HelpDesk
                            </span>
                            <span className="text-xs text-gray-500 -mt-1">24/7 Support</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
                                href={item.href}
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </nav>

                    {/*Show logout button for logged in users*/}
                    {user && (
                        <>
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-gray-700 font-medium">Welcome, {user.displayName || user.email}</span>

                                {/* Notification Bell Icon */}
                                <Link href="/notifications" className="relative">
                                    <LuBell className="text-xl text-gray-700 hover:text-indigo-600 transition-colors" />
                                    {hasNotifications && (
                                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
                                    )}
                                </Link>

                                <Button
                                    className="rounded-full flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                                    onClick={() => {
                                        logout();
                                    }}
                                >
                                    <LuLogOut className="text-xl" />
                                    Logout
                                </Button>
                            </div>
                        </>
                    )}
                    {/*Show login button for logged out users*/}
                    {!user && (
                        <Button
                            className="hidden rounded-full md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                        >
                            <LuLogIn className="text-xl" />
                            Login
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden bg-white shadow-lg rounded-b-2xl mt-2 mx-4 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col p-4 gap-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all border-b border-gray-100 last:border-0"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/*Show notification link and logout button for logged in users*/}
                        {user && (
                            <>
                                <Link
                                    href="/notifications"
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 rounded-full px-4 py-2 text-white shadow-md"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="relative inline-block">
                                        <LuBell className="text-xl" />
                                        {hasNotifications && (
                                            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></div>
                                        )}
                                    </div>
                                    <span>Notifications</span>
                                </Link>
                                <Button
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                                    onClick={() => {
                                        logout();
                                    }}
                                >
                                    <LuLogOut className="mr-2" />
                                    Logout
                                </Button>
                            </>
                        )}
                        {/*Show login button for logged out users*/}
                        {!user && (
                            <Button
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                                onClick={() => {
                                    window.location.href = "/login";
                                }}
                            >
                                <LuLogIn className="mr-2" />
                                Login
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}

const navItems = [
    { label: "Home", href: "/" },
    { label: "Help Desk", href: "/help-desk" },
    { label: "Forum", href: "/replies" },
    { label: "FAQs", href: "/faqs" },
];
