import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <CardDescription>
                        Sign in to manage your portfolio content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Button
                            variant="outline"
                            className="w-full py-6 flex gap-2 text-lg"
                            onClick={() => window.location.href = "/api/auth/google"}
                        >
                            <FaGoogle className="w-5 h-5" />
                            Sign in with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
