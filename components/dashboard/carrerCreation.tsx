"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface CareerRecommendation {
  title: string;
  description: string;
  industry: string;
  emerging: boolean;
}

function CarrerCreation({
  studentId,
  onCareerSelected, // callback to notify parent dashboard
}: {
  studentId: string | null;
  onCareerSelected: () => void;
}) {
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch career recommendations
  const fetchCareerRecommendations = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/careerRecommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        const data = await response.json();
        const recommendations =
          data.data.recommendations?.map((rec: any) => ({
            title: rec.job_title,
            description: rec.job_description,
            industry: rec.industry_outlook,
            emerging: rec.emerging || false,
          })) || [];

        setCareerRecommendations(recommendations);
      } else {
        throw new Error("Failed to fetch career recommendations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load career recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Select a career
  const selectCareer = async (career: CareerRecommendation) => {
    if (!studentId) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/career/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          careerData: career,
        }),
      });

      if (response.ok) {
        setSelectedCareer(career);
        toast.success(`Career selected: ${career.title}`);
        onCareerSelected(); // notify parent to fetch roadmap
      } else {
        throw new Error("Failed to save career");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to select career");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerRecommendations();
  }, [studentId]);

  if (loading && careerRecommendations.length === 0) {
    return <p>Loading career recommendations...</p>;
  }

  return (
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
            {careerRecommendations.map((career, index) => (
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
}

export default CarrerCreation;
