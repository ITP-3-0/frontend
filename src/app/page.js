"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LuTicketCheck, LuArrowRight } from "react-icons/lu";
import { FaQuestion, FaHeadset } from "react-icons/fa";
import { HiOutlineSupport } from "react-icons/hi";
import { useAuth } from "@/Firebase/AuthContext";
import NavBar from "./_Components/NavBar";
import { ChatWidget } from "@/components/chat-widget";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";

export default function Home() {
    const { loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingComponent />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 overflow-hidden">
            <NavBar />

            {/* Hero Section */}
            <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="flex flex-col gap-6 max-w-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-700 border border-indigo-100 shadow-sm w-fit">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                            24/7 Support Available
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                            Tech troubles? <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                                We&apos;ve got you covered
                            </span>
                        </h1>

                        <p className="text-xl text-gray-700 leading-relaxed">
                            Get instant solutions from our knowledge base or raise a support ticket for personalized assistance from our expert team.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <Link href="/tickets/create">
                                <Button className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                                    <LuTicketCheck className="mr-2 text-lg" />
                                    Raise a Ticket
                                    <LuArrowRight className="ml-2" />
                                </Button>
                            </Link>

                            <Button
                                variant="outline"
                                className="h-14 px-8 bg-white/80 backdrop-blur-sm rounded-full text-indigo-700 border-indigo-200 hover:bg-white hover:border-indigo-300 shadow-md transition-all hover:-translate-y-0.5"
                            >
                                <FaQuestion className="mr-2" />
                                Browse FAQs
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">JD</div>
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">KL</div>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">MN</div>
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                    +5
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">2,500+</span> tickets resolved this month
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <div className="relative z-10">
                            <Image src="/women_on_homepage.png" alt="Support" width={600} height={600} className="object-contain" priority />
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <HiOutlineSupport className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Quick Response</p>
                                <p className="text-xs text-gray-500">Average: 15 minutes</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 -right-5 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <FaHeadset className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Expert Support</p>
                                <p className="text-xs text-gray-500">Certified technicians</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <motion.div
                className="bg-white/70 backdrop-blur-md py-16"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">How We Can Help You</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Our comprehensive support system is designed to get your tech issues resolved quickly and efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 ${feature.bgColor}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                <ChatWidget />
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-1/4 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-0 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
        </div>
    );
}

const features = [
    {
        title: "Raise Support Tickets",
        description: "Create detailed support tickets and track their progress until resolution.",
        icon: <LuTicketCheck className="text-xl" />,
        bgColor: "bg-gradient-to-r from-indigo-600 to-purple-600",
    },
    {
        title: "Knowledge Base",
        description: "Access our comprehensive FAQ library for instant solutions to common problems.",
        icon: <FaQuestion className="text-xl" />,
        bgColor: "bg-gradient-to-r from-purple-600 to-blue-600",
    },
    {
        title: "Live Support",
        description: "Connect with our support team through live chat for real-time assistance.",
        icon: <FaHeadset className="text-xl" />,
        bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600",
    },
];
