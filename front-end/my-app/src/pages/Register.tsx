// Register.tsx
// src/pages/Register.tsx

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error(error);
            alert(error.message);
        }
        else {
            // Redirect to login after successful Register
            alert("Check your email or try logging in if you disabled confirmation!");
            navigate("/login");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 transition-colors duration-300">
            <Card className="w-full max-w-md">

                {/* Header */}
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Journal App</CardTitle>
                    <CardDescription className="text-center">
                        Create an account
                    </CardDescription>
                </CardHeader>

                {/* Login form */}
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="dummy@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Processing..." : "Register"}
                        </Button>
                        <p
                            className="self-end text-right text-sm text-muted-foreground">
                            Already have an account?
                            <Link to="/login" className="text-indigo-500 hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>

            </Card>
        </div>
    );
}