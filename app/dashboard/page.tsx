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
}

function Dashboard() {
  const [hasProfile, setHasProfile] = useState(false);
  const [careerSelected, setCareerSelected] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
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
        const roadmapData = await response.json();
        setRoadmap(roadmapData);
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
  }, [studentId]);

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
    return <CarrerCreation onCareerSelected={() => fetchRoadmap()} studentId={studentId} />;
  }

  // Step 3: Show roadmap
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Career Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmap.length === 0 ? (
            <p>No roadmap generated yet. Select a career to generate roadmap.</p>
          ) : (
            roadmap.map((step, index) => (
              <Card key={index} className="border p-4">
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
