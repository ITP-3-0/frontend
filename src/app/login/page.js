"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        census: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login attempt with:", formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-300 to-purple-500">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="bg-white/95 w-full max-w-4xl rounded-[2rem] shadow-xl flex">
                    {/* Left side - Image */}
                    <div className="relative hidden md:block w-1/2">
                        <Image src="/women_on_homepage.png" alt="Customer support" className="object-cover rounded-l-[2rem]" fill priority />
                    </div>

                    {/* Right side - Login Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                        <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="census">Census no</Label>
                                <Input
                                    id="census"
                                    type="text"
                                    value={formData.census}
                                    onChange={(e) => setFormData({ ...formData, census: e.target.value })}
                                    placeholder="123456"
                                    className="rounded-full px-6"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="rounded-full px-6"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={formData.rememberMe}
                                        onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked })}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-6">
                                Login Now
                            </Button>

                            <div className="text-center text-sm">
                                Don't have any account?{" "}
                                <Link href="/register" className="text-purple-600 hover:underline">
                                    Register Now
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
