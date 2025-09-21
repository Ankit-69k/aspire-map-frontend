"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Map, MessageCircle, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <User className="h-8 w-8" />,
      title: "Personal Profile",
      description: "Build a comprehensive profile that tracks your skills, interests, and career aspirations.",
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Adaptive Learning Roadmap",
      description: "Get personalized learning paths that adapt to your progress and career goals.",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Career Chatbot",
      description: "Get instant answers to your career questions from our intelligent AI assistant.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Smart Recommendations",
      description: "Receive tailored job recommendations and skill suggestions based on your profile.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-primary "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            AspireMap
          </motion.h1>
          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90">
              Signup / Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shape Your Career Journey with <span className="text-primary">AI-Powered Guidance</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover your potential, build essential skills, and navigate your career path with personalized roadmaps
            and intelligent recommendations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-[var(--font-playfair)]">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our comprehensive platform provides all the tools and guidance you need to advance your career.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-pretty">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 font-[var(--font-playfair)]">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Join thousands of professionals who have already started their journey to career success.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2024 AspireMap. Empowering careers through intelligent guidance.</p>
        </div>
      </footer>
    </div>
  );
}
