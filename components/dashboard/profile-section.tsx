"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Calendar, Edit, Star, TrendingUp, Target } from "lucide-react";

export function ProfileSection() {
  const skills = [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 90 },
    { name: "Node.js", level: 75 },
    { name: "Python", level: 70 },
    { name: "SQL", level: 80 },
  ];

  const achievements = [
    "Completed Full-Stack Development Course",
    "Built 5+ React Applications",
    "Contributed to Open Source Projects",
    "AWS Certified Developer",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]">Your Profile</h1>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">John Doe</CardTitle>
              <CardDescription>Software Developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                john.doe@email.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined March 2024
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Career Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transition to a Senior Full-Stack Developer role at a tech startup, focusing on React and Node.js
                technologies while building scalable web applications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Skills Progress
              </CardTitle>
              <CardDescription>Track your skill development and identify areas for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{skill.name}</Label>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your career milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      ✓
                    </Badge>
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Tell us about your background and interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a brief description about your professional background..."
                  className="min-h-[100px]"
                  defaultValue="Passionate software developer with 3+ years of experience building web applications. I love creating user-friendly interfaces and solving complex problems with clean, efficient code."
                />
              </div>
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
