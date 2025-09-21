"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProfileCreation from "@/components/dashboard/profileCreation";
import CarrerCreation from "@/components/dashboard/carrerCreation";
import { useSearchParams } from "next/navigation";

interface RoadmapStep {
  step: string;
  description: string;
  completed: boolean;
  skill: string;
}

function Dashboard() {
  const [hasProfile, setHasProfile] = useState(false);
  const [careerSelected, setCareerSelected] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [careerTitle, setCareerTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const studentId = useSearchParams().get("studentId");

  // Check if profile and career exist
  const fetchUserStatus = async () => {
    if (!studentId) return;

    try {
      setLoading(true);

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${studentId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setHasProfile(!!profileData);

        if (profileData?.selectedCareer) {
          setCareerSelected(true);
          fetchRoadmap();
        }
      }
    } catch (err) {
      toast.error("Failed to fetch user status");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmap = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/careerRoadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        const data = await response.json();

        const roadmapData = data.data.roadmap;

        // 🔑 map API response into your state
        const career = roadmapData?.career?.title ?? null;
        setCareerTitle(career);

        const steps = roadmapData?.roadmap?.steps ?? [];
        const mappedSteps: RoadmapStep[] = steps.map((s: any) => ({
          step: s.title,
          description: `Skill: ${s.skill?.name ?? "N/A"}`,
          status: s.completed ? "completed" : "upcoming",
          progress: s.completed ? 100 : 0,
          duration: "4 weeks",
          skill: [s.skill?.name ?? "General"],
        }));

        setRoadmap(mappedSteps);
      } else {
        throw new Error("Failed to fetch roadmap");
      }
    } catch (err) {
      toast.error("Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Step 1: Show profile creation
  if (!hasProfile) {
    return <ProfileCreation studentId={studentId} setHasProfile={setHasProfile} />;
  }

  // Step 2: Show career selection
  if (hasProfile && !careerSelected) {
    return (
      <CarrerCreation
        onCareerSelected={() => {
          setCareerSelected(true);
          fetchRoadmap();
        }}
        studentId={studentId}
      />
    );
  }

  // Step 3: Show roadmap
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{careerTitle ? `Career Roadmap: ${careerTitle}` : "Your Career Roadmap"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmap.length === 0 ? (
            <p>No roadmap generated yet. Select a career to generate roadmap.</p>
          ) : (
            roadmap.map((step, index) => (
              <Card key={index} className={`border p-4 ${step.completed ? "bg-green-500" : ""}`}>
                <h3 className="font-semibold">{step.step}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
