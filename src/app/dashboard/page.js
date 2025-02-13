"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5";
import { FiMonitor } from "react-icons/fi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuTicket } from "react-icons/lu";

const stats = [
    { title: "Total Tickets", value: "1,482", icon: "🎫" },
    { title: "Resolved", value: "1,285", icon: "✓" },
    { title: "Pending", value: "149", icon: "⏳" },
    { title: "Urgent", value: "48", icon: "⚠️" },
];

const recentTickets = [
    { id: "#1234", subject: "Cannot access my account", status: "Pending", priority: "High", created: "2 hours ago" },
    { id: "#1233", subject: "Need help with integration", status: "Resolved", priority: "Medium", created: "5 hours ago" },
    { id: "#1232", subject: "Payment failed", status: "Resolved", priority: "Low", created: "1 day ago" },
];

const announcements = [
    { id: "#1234", subject: "This site is unavailable 12th feb 1:00 A.M to 3:30 A.M due to maintain", created: "6 hours ago" },
    { id: "#1233", subject: "Password reset needed to all users", created: "15 hours ago" },
    { id: "#1232", subject: "Payment failed", created: "3 days ago" },
];

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-gray-50 pt-16">
            {/* Sidebar */}
            <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl font-semibold text-purple-700">SchoolDesk</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg text-purple-900">
                        <FiMonitor className="h-5 w-5" />
                        <span>Dashboard</span>
                    </div>
                    <Link href="/tickets" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <LuTicket className="h-5 w-5" />
                        <span>Tickets</span>
                    </Link>
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
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                        <p className="text-gray-600">Monitor your helpdesk performance and manage tickets efficiently.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Logout</button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-gray-500">{stat.title}</span>
                            </div>
                            <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-xl shadow-sm mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Recent Tickets</h2>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500">
                                    <th className="pb-4">ID</th>
                                    <th className="pb-4">Subject</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Priority</th>
                                    <th className="pb-4">Created</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-t">
                                        <td className="py-4">{ticket.id}</td>
                                        <td>{ticket.subject}</td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${
                                                    ticket.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td>
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
                                        <td className="text-gray-500">{ticket.created}</td>
                                        <td>
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

                {/* Recent Announcements */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Recent Announcements</h2>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500">
                                    <th className="pb-4">ID</th>
                                    <th className="pb-4">Subject</th>
                                    <th className="pb-4">Created</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map((announcement) => (
                                    <tr key={announcement.id} className="border-t">
                                        <td className="py-4">{announcement.id}</td>
                                        <td>{announcement.subject}</td>
                                        <td className="text-gray-500">{announcement.created}</td>
                                        <td>
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
        </div>
    );
}
