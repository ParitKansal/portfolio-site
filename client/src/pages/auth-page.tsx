import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";

export default function AuthPage() {
    const { user } = useAuth();

    if (user) {
        return <Redirect to="/admin" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-md">
                    <CardHeader className="space-y-2 text-center">
                        <div className="mx-auto w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                            <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Admin Access</CardTitle>
                        <CardDescription>
                            Sign in to manage your portfolio content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            className="w-full py-5 gap-2.5"
                            onClick={() => window.location.href = "/api/auth/google"}
                        >
                            <FaGoogle className="w-4 h-4" aria-hidden="true" />
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back to portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
