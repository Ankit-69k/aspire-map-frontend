"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const url = isRegister
        ? `${process.env.NEXT_PUBLIC_API_URL}/student`
        : `${process.env.NEXT_PUBLIC_API_URL}/student/login`;

      const body = isRegister ? { name, email, password } : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Auth failed:", data.message);
        toast.error(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        toast.success("Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard?studentId=" + data.data.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero Section (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 border-r  border-white my-8  items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center space-y-6"
        >
          <h1 className="text-4xl font-bold">Welcome to AspireMap</h1>
          <p className="text-lg opacity-90">
            Shape your career journey with AI-powered guidance, adaptive learning roadmaps, and smart recommendations.
          </p>
        </motion.div>
      </div>
      {/* Right Side - Auth Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center h-screen p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{isRegister ? "Create Account" : "Login"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <Label className="block text-sm font-medium mb-1">Name</Label>
                  <Input type="text" name="name" placeholder="Enter your name" required />
                </div>
              )}
              <div>
                <Label className="block text-sm font-medium mb-1">Email</Label>
                <Input type="email" name="email" placeholder="Enter your email" required />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Password</Label>
                <Input type="password" name="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {isRegister ? "Sign Up" : "Login"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline">
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
