"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMonitor } from "react-icons/fi";
import { LuTicket } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BsPaperclip, BsImage } from "react-icons/bs";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Mock data for announcements
const initialAnnouncements = [
    { id: "#1246", subject: "green lines in screen", lastModified: "2 hours ago" },
    { id: "#1245", subject: "Need help with integration", lastModified: "5 hours ago" },
    { id: "#1244", subject: "Power failed", lastModified: "1 day ago" },
    { id: "#1243", subject: "Cannot access my account", lastModified: "2 hours ago" },
    { id: "#1242", subject: "Need help to install drivers", lastModified: "5 hours ago" },
    { id: "#1241", subject: "driver errors", lastModified: "1 day ago" },
    { id: "#1240", subject: "Cannot access my account", lastModified: "2 hours ago" },
];

export default function AnnouncementsPage() {
    const [announcements] = useState(initialAnnouncements);
    const [newAnnouncement, setNewAnnouncement] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle announcement submission
        console.log("New announcement:", newAnnouncement);
        setNewAnnouncement("");
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
                    <Link href="/reports" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <HiOutlineDocumentReport className="h-5 w-5" />
                        <span>Reports</span>
                    </Link>
                    <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg text-purple-900">
                        <MdOutlineAnnouncement className="h-5 w-5" />
                        <span>Announcement</span>
                    </div>
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

                {/* Create Announcement Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Add Title"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <textarea
                                value={newAnnouncement}
                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                placeholder="Subject"
                                className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                        <BsPaperclip className="h-5 w-5" />
                                    </button>
                                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                        <BsImage className="h-5 w-5" />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Post Announcement
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Recent Announcement</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-4 px-6 text-gray-500">ID</th>
                                <th className="py-4 px-6 text-gray-500">Subject</th>
                                <th className="py-4 px-6 text-gray-500">Last Modified</th>
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((announcement) => (
                                <tr key={announcement.id} className="border-b last:border-b-0">
                                    <td className="py-4 px-6">{announcement.id}</td>
                                    <td className="py-4 px-6">{announcement.subject}</td>
                                    <td className="py-4 px-6 text-gray-500">{announcement.lastModified}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2 justify-end">
                                            <button className="p-1 text-blue-500 hover:text-blue-700">
                                                <FiEdit2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-red-500 hover:text-red-700">
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </div>
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