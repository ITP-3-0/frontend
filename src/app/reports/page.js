"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FiMonitor } from "react-icons/fi";
import { LuTicket } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generatePDF } from "@/utils/generatePDF";

// Mock data for statistics
const stats = [
    {
        title: "Total Tickets",
        value: "1,482",
        trend: "+12.5%",
        trendDirection: "up",
        icon: "🎫",
        comparison: "from last month",
    },
    {
        title: "Response Rate",
        value: "94.2%",
        trend: "+3.2%",
        trendDirection: "up",
        icon: "✓",
        comparison: "from last month",
    },
    {
        title: "Avg Response Time",
        value: "2.4h",
        trend: "-1.8%",
        trendDirection: "down",
        icon: "⏱️",
        comparison: "from last month",
    },
    {
        title: "User Satisfaction",
        value: "4.8/5",
        trend: "+0.3",
        trendDirection: "up",
        icon: "⭐",
        comparison: "from last month",
    },
];

const recentActivity = [
    {
        type: "new_ticket",
        title: "New ticket created",
        description: "Technical issue with login system",
        timeAgo: "2 hours ago",
        icon: "🎫",
    },
    {
        type: "resolved",
        title: "Ticket resolved",
        description: "Network connectivity issue fixed",
        timeAgo: "4 hours ago",
        icon: "✓",
    },
    {
        type: "feedback",
        title: "New feedback received",
        description: "5-star rating from user #1234",
        timeAgo: "6 hours ago",
        icon: "⭐",
    },
];

// Data for pie chart
const statusData = [
    { name: "Resolved", value: 73, color: "#22c55e" },
    { name: "Pending", value: 16, color: "#eab308" },
    { name: "Urgent", value: 11, color: "#ef4444" },
];

// Data for bar chart
const issueTypesData = [
    { name: "Power Issues", thisWeek: 35, thisMonth: 42 },
    { name: "Screen Issues", thisWeek: 45, thisMonth: 65 },
    { name: "Technical Issues", thisWeek: 30, thisMonth: 38 },
    { name: "Other Issues", thisWeek: 40, thisMonth: 55 },
];

export default function ReportsPage() {
    const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);

    const handleTimeframeChange = (timeframe) => {
        setSelectedTimeframe(timeframe);
    };

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
                    <Link href="/tickets" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <LuTicket className="h-5 w-5" />
                        <span>Tickets</span>
                    </Link>
                    <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg text-purple-900">
                        <HiOutlineDocumentReport className="h-5 w-5" />
                        <span>Reports</span>
                    </div>
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                    <p className="text-gray-600">Monitor your helpdesk performance and trends.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-gray-500">{stat.title}</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <span className={`text-sm ${stat.trendDirection === "up" ? "text-green-600" : "text-red-600"}`}>{stat.trend}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{stat.comparison}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Tickets by Status */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Tickets by Status</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTimeframeChange("This Week")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedTimeframe === "This Week" ? "bg-purple-100 text-purple-800" : "text-gray-500"
                                    }`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => handleTimeframeChange("This Month")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedTimeframe === "This Month" ? "bg-purple-100 text-purple-800" : "text-gray-500"
                                    }`}
                                >
                                    This Month
                                </button>
                            </div>
                        </div>
                        <div className="h-64" ref={pieChartRef}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `${value}%`}
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <button
                            onClick={() => generatePDF(statusData, "status", pieChartRef)}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Download Report
                        </button>
                    </div>

                    {/* Issue Types */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Issue Types</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTimeframeChange("This Week")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedTimeframe === "This Week" ? "bg-purple-100 text-purple-800" : "text-gray-500"
                                    }`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => handleTimeframeChange("This Month")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedTimeframe === "This Month" ? "bg-purple-100 text-purple-800" : "text-gray-500"
                                    }`}
                                >
                                    This Month
                                </button>
                            </div>
                        </div>
                        <div className="h-64" ref={barChartRef}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={issueTypesData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey={selectedTimeframe === "This Week" ? "thisWeek" : "thisMonth"}
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <button
                            onClick={() => generatePDF(issueTypesData, "issues", barChartRef)}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Add New Graph Button */}
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                    <FaPlus className="h-4 w-4" />
                    Add New Graph
                </button>
            </div>
        </div>
    );
}
