"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { register } from "@/Firebase/FirebaseFunctions";
import NavBar from "../_Components/NavBar";
import { Loader2 } from "lucide-react";

// TODO : 
// The loading button is not working as expected. It should stop spinning once an error occurs.

export default function RegisterPage() {
    const [census, setCensus] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        register(email, password, census).catch((error) => {
            setButtonLoading(false);
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 flex items-center justify-center pt-14 px-4 md:px-0">
            <NavBar />
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-xl flex flex-col md:flex-row">
                {/* Right side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-purple-50/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Let&apos;s Get Started!</h1>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="census">Census no</Label>
                                <Input
                                    id="census"
                                    placeholder="Enter your census number"
                                    type="text"
                                    className="bg-white"
                                    value={census}
                                    onChange={(e) => setCensus(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    placeholder="Enter your email"
                                    id="email"
                                    type="email"
                                    className="bg-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    placeholder="Enter a strong password"
                                    id="password"
                                    type="password"
                                    className="bg-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white">
                                {buttonLoading ? <Loader2 className="animate-spin" /> : ""}
                                Register
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:underline">
                                    Login Now
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Left side - Image */}
                <div className="relative hidden md:block w-full md:w-1/2">
                    <Image src="/man_on_register.jpg" alt="Customer service representative" className="object-cover" fill priority />
                </div>
            </div>
        </div>
    );
}
