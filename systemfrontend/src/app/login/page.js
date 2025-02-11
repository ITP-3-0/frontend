"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginPage() {
    const [census, setCensus] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(census, password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 flex items-center justify-center p-4 md:p-0">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-xl flex flex-col md:flex-row">
                {/* Left side - Image */}
                <div className="relative hidden md:block w-full md:w-1/2">
                    <Image src="/women_on_login.jfif" alt="Customer service representative" className="object-cover" fill priority />
                </div>

                {/* Right side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-purple-50/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="census">Census no</Label>
                                <Input
                                    value={census}
                                    onChange={(e) => setCensus(e.target.value)}
                                    id="census"
                                    placeholder="123456"
                                    type="text"
                                    className="bg-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    className="bg-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white">
                                Login Now
                            </Button>

                            <div className="text-center text-sm">
                                Don&apos;t have any account?{" "}
                                <Link href="/register" className="text-blue-500 hover:underline">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
