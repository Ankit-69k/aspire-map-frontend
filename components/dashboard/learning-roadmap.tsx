"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, BookOpen, Award, ArrowRight, Play } from "lucide-react";

export function LearningRoadmap() {
  const roadmapItems = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Master the core concepts of JavaScript programming",
      status: "completed",
      progress: 100,
      duration: "4 weeks",
      skills: ["Variables", "Functions", "Objects", "Arrays"],
    },
    {
      id: 2,
      title: "React Development",
      description: "Build modern web applications with React",
      status: "in-progress",
      progress: 65,
      duration: "6 weeks",
      skills: ["Components", "Hooks", "State Management", "Routing"],
    },
    {
      id: 3,
      title: "Node.js Backend",
      description: "Create server-side applications with Node.js",
      status: "upcoming",
      progress: 0,
      duration: "5 weeks",
      skills: ["Express.js", "APIs", "Database Integration", "Authentication"],
    },
    {
      id: 4,
      title: "Database Design",
      description: "Learn SQL and database optimization techniques",
      status: "upcoming",
      progress: 0,
      duration: "4 weeks",
      skills: ["SQL Queries", "Database Design", "Optimization", "NoSQL"],
    },
    {
      id: 5,
      title: "DevOps Basics",
      description: "Understand deployment and CI/CD processes",
      status: "locked",
      progress: 0,
      duration: "3 weeks",
      skills: ["Docker", "AWS", "CI/CD", "Monitoring"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Play className="h-5 w-5 text-blue-500" />;
      case "upcoming":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case "locked":
        return <Circle className="h-5 w-5 text-muted-foreground opacity-50" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "locked":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-playfair)]">Learning Roadmap</h1>
          <p className="text-muted-foreground mt-2">Your personalized path to becoming a Senior Full-Stack Developer</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">65%</div>
          <div className="text-sm text-muted-foreground">Overall Progress</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>2 of 5 modules completed</span>
            </div>
            <Progress value={40} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">1</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">1</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">2</div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">1</div>
                <div className="text-xs text-muted-foreground">Locked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Items */}
      <div className="space-y-4">
        {roadmapItems.map((item, index) => (
          <Card key={item.id} className={`${item.status === "locked" ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)} variant="outline">
                      {item.status.replace("-", " ")}
                    </Badge>
                  </div>

                  {item.status === "in-progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {item.skills.length} skills
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {item.status === "completed" && (
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    )}
                    {item.status === "in-progress" && (
                      <Button size="sm" className="gap-2">
                        Continue Learning
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                    {item.status === "upcoming" && (
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
