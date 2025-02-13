"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMonitor } from "react-icons/fi";
import { LuTicket } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";

// Mock data for tickets
const initialTickets = [
    { id: "#1246", subject: "green lines in screen", status: "Pending", priority: "High", created: "2 hours ago" },
    { id: "#1245", subject: "Need help with integration", status: "Resolved", priority: "Medium", created: "5 hours ago" },
    { id: "#1244", subject: "Power failed", status: "Resolved", priority: "Medium", created: "1 day ago" },
    { id: "#1243", subject: "Cannot access my account", status: "Pending", priority: "Low", created: "2 hours ago" },
    { id: "#1242", subject: "Need help to install drivers", status: "Pending", priority: "Medium", created: "5 hours ago" },
    { id: "#1241", subject: "driver errors", status: "Pending", priority: "High", created: "1 day ago" },
    { id: "#1240", subject: "Cannot access my account", status: "Urgent", priority: "High", created: "2 hours ago" },
    { id: "#1239", subject: "Need help with integration", status: "Resolved", priority: "Medium", created: "5 hours ago" },
    { id: "#1238", subject: "Payment failed", status: "Resolved", priority: "Low", created: "1 day ago" },
    { id: "#1237", subject: "Cannot access my account", status: "Pending", priority: "High", created: "2 hours ago" },
    { id: "#1236", subject: "Need help with integration", status: "Urgent", priority: "Medium", created: "5 hours ago" },
    { id: "#1235", subject: "Payment failed", status: "Resolved", priority: "Low", created: "1 day ago" },
    { id: "#1234", subject: "Cannot access my account", status: "Pending", priority: "High", created: "2 hours ago" },
    { id: "#1233", subject: "Need help with integration", status: "Resolved", priority: "Medium", created: "5 hours ago" },
    { id: "#1232", subject: "Payment failed", status: "Resolved", priority: "Low", created: "1 day ago" },
];

const stats = [
    { label: "Opened Tickets", value: "13", icon: "🎫" },
    { label: "Resolved", value: "1,285", icon: "✓" },
    { label: "Pending", value: "149", icon: "⏳" },
    { label: "Urgent", value: "48", icon: "⚠️" },
];

export default function TicketsPage() {
    const [selectedCategory, setSelectedCategory] = useState("Smart Board");
    const [tickets] = useState(initialTickets);

    return (
        <div className="flex min-h-screen bg-gray-50 pt-16">
            {/* Sidebar */}
            <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl font-semibold text-purple-700">SchoolDesk</span>
                </div>

                <div className="space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <FiMonitor className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg text-purple-900">
                        <LuTicket className="h-5 w-5" />
                        <span>Tickets</span>
                    </div>
                    <Link href="/reports" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <HiOutlineDocumentReport className="h-5 w-5" />
                        <span>Reports</span>
                    </Link>
                    <Link href="/announcements" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MdOutlineAnnouncement className="h-5 w-5" />
                        <span>Announcement</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <IoSettingsOutline className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-8">
                {/* Header with User Info */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/avatar.png"
                            alt="John Smith"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div>
                            <h2 className="font-semibold">John Smith</h2>
                            <p className="text-sm text-gray-500">Admin</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Logout
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setSelectedCategory("Smart Board")}
                        className={`px-6 py-2 rounded-lg ${
                            selectedCategory === "Smart Board"
                                ? "bg-purple-100 text-purple-900"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        Smart Board
                    </button>
                    <button
                        onClick={() => setSelectedCategory("Hardware")}
                        className={`px-6 py-2 rounded-lg ${
                            selectedCategory === "Hardware"
                                ? "bg-purple-100 text-purple-900"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        Hardware
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-gray-500">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-xl shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-4 px-6 text-gray-500">ID</th>
                                <th className="py-4 px-6 text-gray-500">Subject</th>
                                <th className="py-4 px-6 text-gray-500">Status</th>
                                <th className="py-4 px-6 text-gray-500">Priority</th>
                                <th className="py-4 px-6 text-gray-500">Created</th>
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="border-b last:border-b-0">
                                    <td className="py-4 px-6">{ticket.id}</td>
                                    <td className="py-4 px-6">{ticket.subject}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                ticket.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : ticket.status === "Resolved"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                ticket.priority === "High"
                                                    ? "bg-red-100 text-red-800"
                                                    : ticket.priority === "Medium"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">{ticket.created}</td>
                                    <td className="py-4 px-6">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <BsThreeDotsVertical />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 