import Link from "next/link";
import { LockIcon, HomeIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mx-auto max-w-md space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                        <LockIcon className="h-12 w-12 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight">Access Restricted</h1>

                <div className="space-y-4">
                    <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>

                    <div className="pt-4">
                        <p className="text-sm text-muted-foreground">
                            If you are an administrator or support agent, login with your administrative credentials .
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-center">
                    <Button asChild variant="default">
                        <Link href="/login" className="flex items-center gap-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Sign In
                        </Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/" className="flex items-center gap-2">
                            <HomeIcon className="h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
