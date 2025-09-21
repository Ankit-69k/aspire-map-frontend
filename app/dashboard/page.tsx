"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Map, MessageCircle, Settings, Upload, Plus, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import ProfileCreation from "@/components/dashboard/profileCreation";

type TabType = "profile" | "roadmap" | "chatbot" | "settings";

interface Profile {
  id: string;
  studentId: string;
  education: string;
  subjects: string[];
  certifications: string[];
  projects: string[];
  internships: string[];
  hobbies: string[];
  resumeUrl?: string;
  linkedInUrl?: string;
}

interface CareerRecommendation {
  title: string;
  description: string;
  industry: string;
  emerging: boolean;
}

interface Roadmap {
  id: string;
  profileId: string;
  steps: Array<{
    title: string;
    description: string;
    duration: string;
    resources: string[];
  }>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = useSearchParams();

  const tabs = [
    { id: "profile" as TabType, label: "Your Profile", icon: User },
    { id: "roadmap" as TabType, label: "Learning Roadmap", icon: Map },
    { id: "chatbot" as TabType, label: "AI Chatbot", icon: MessageCircle },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const init = async () => {
      const id = studentId.get("studentId");
      if (id) {
        await checkProfile(id);
      }
      setLoading(false);
    };
    init();
  }, []);

  const checkProfile = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${id}`);
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        await getCareerRecommendations(profileData.id);
        await getRoadmap(profileData.id);
      } else if (response.status === 404) {
        // Profile doesn't exist
        setProfile(null);
      } else {
        throw new Error("Failed to check profile");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const getCareerRecommendations = async (profileId: string) => {
    if (!profileId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/careerRecommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
      });

      if (response.ok) {
        const recommendations = await response.json();
        setCareerRecommendations(recommendations);
      }
    } catch (err) {
      setError("Failed to get career recommendations");
    }
  };

  const selectCareer = async (career: CareerRecommendation) => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profile.id,
          careerData: career,
        }),
      });

      if (response.ok) {
        setSelectedCareer(career);
        await generateRoadmap();
      } else {
        throw new Error("Failed to select career");
      }
    } catch (err) {
      setError("Failed to select career");
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!profile?.id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/careerRoadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profile.id,
        }),
      });

      if (response.ok) {
        const roadmapData = await response.json();
        setRoadmap(roadmapData);
      }
    } catch (err) {
      setError("Failed to generate roadmap");
    }
  };

  const getRoadmap = async (profileId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/${profileId}`);
      if (response.ok) {
        const roadmapData = await response.json();
        setRoadmap(roadmapData);
      }
    } catch (err) {
      // Roadmap might not exist yet
    }
  };

  const CareerRecommendations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Recommendations</CardTitle>
          <CardDescription>
            Based on your profile, here are some career paths that match your skills and interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {careerRecommendations?.map((career, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCareer?.title === career.title ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => selectCareer(career)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{career.title}</h3>
                        {career.emerging && <Badge variant="secondary">Emerging Field</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                      <p className="text-sm">
                        <strong>Industry Outlook:</strong> {career.industry}
                      </p>
                    </div>
                    {selectedCareer?.title === career.title && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Education</Label>
            <p className="text-sm text-muted-foreground">{profile?.education}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Technical Skills</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile?.subjects?.map((subject, index) => (
                <Badge key={index} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {profile?.projects && profile.projects.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Projects</Label>
              <ul className="mt-1 space-y-1">
                {profile.projects?.map((project, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile?.internships && profile.internships.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Experience</Label>
              <ul className="mt-1 space-y-1">
                {profile.internships?.map((internship, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {internship}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {!selectedCareer && careerRecommendations.length > 0 && <CareerRecommendations />}

      {selectedCareer && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Career Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{selectedCareer.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedCareer.description}</p>
              <p className="text-sm">
                <strong>Industry Outlook:</strong> {selectedCareer.industry}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const RoadmapView = () => (
    <div className="space-y-6">
      {roadmap ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Roadmap</CardTitle>
            <CardDescription>Follow this personalized roadmap to achieve your career goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roadmap.steps?.map((step, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Step {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground">{step.duration}</span>
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.resources && step.resources.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Resources:</Label>
                        <ul className="mt-1 space-y-1">
                          {step.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              • {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )) || <p className="text-muted-foreground">No roadmap steps available</p>}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                {!selectedCareer
                  ? "Please select a career path from your profile to generate a roadmap"
                  : "Generating your personalized roadmap..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const ChatbotView = () => (
    <Card>
      <CardHeader>
        <CardTitle>AI Career Assistant</CardTitle>
        <CardDescription>
          Ask questions about your career path, skills development, or job market insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          <p>Chatbot interface coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );

  const SettingsView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">Settings panel coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!profile) {
      return <ProfileCreation studentId={studentId.get("studentId")} />;
    }

    switch (activeTab) {
      case "profile":
        return <ProfileView />;
      case "roadmap":
        return <RoadmapView />;
      case "chatbot":
        return <ChatbotView />;
      case "settings":
        return <SettingsView />;
      default:
        return <ProfileView />;
    }
  };

  const isTabDisabled = (tabId: TabType) => {
    if (!profile) return tabId !== "profile";
    if (tabId === "roadmap" && !selectedCareer) return true;
    return false;
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <span className="text-lg font-bold">CareerPath</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const disabled = isTabDisabled(tab.id);
              return (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    isActive={activeTab === tab.id}
                    onClick={() => !disabled && setActiveTab(tab.id)}
                    size="lg"
                    disabled={disabled}
                    className={disabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.png" />
              <AvatarFallback>{profile ? profile.studentId?.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile ? `Student ${profile.studentId?.substring(0, 8)}` : "New User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedCareer ? selectedCareer.title : "No career selected"}
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
          {!profile && (
            <Badge variant="destructive" className="ml-auto">
              Profile Required
            </Badge>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4">
          {error && (
            <Card className="mb-4 border-destructive">
              <CardContent className="flex items-center gap-2 pt-4">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </CardContent>
            </Card>
          )}
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
