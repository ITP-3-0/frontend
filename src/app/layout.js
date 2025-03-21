import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Firebase/AuthContext";
import { ButtonProvider } from "./Contexts/ButtonContext";
import { ChatWidget } from "@/components/chat-widget"
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "E-Guru | School Ticketing System",
    description: "E-Guru is a school ticketing system that helps schools manage their students' tickets.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <main>
                    <AuthProvider>
                        <ButtonProvider>{children}</ButtonProvider>
                    </AuthProvider>
                    <ChatWidget />
                </main>
                <Toaster />
            </body>
        </html>
    );
}
