"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";

function ProfileCreation({ studentId }: { studentId: string | null }) {
  const [formData, setFormData] = useState({
    education: [] as string[],
    skills: [] as string[],
    projects: [] as string[],
    experience: [] as string[],
    certifications: [] as string[],
    hobbies: [] as string[],
    linkedInUrl: "",
  });

  const [loading, setLoading] = useState(false);

  // temporary inputs
  const [newEducation, setNewEducation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newExperience, setNewExperience] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const handleResumeUpload = async (file: File) => {
    if (!studentId) {
      toast.error("Student ID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/resumeUpload`, {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const extractedData = await response.json();
        console.log("Extracted Data:", extractedData);

        const content = extractedData.data.content; // <-- your main payload

        setFormData({
          education: (content.education || []).map((edu: any) => `${edu.degree}, ${edu.institution} (${edu.year})`),
          skills: [
            ...(content.skills?.programming || []),
            ...(content.skills?.frameworks || []),
            ...(content.skills?.databases || []),
            ...(content.skills?.technical || []),
            ...(content.skills?.tools || []),
            ...(content.skills?.soft || []),
          ],
          experience: (content.experience || []).map((exp: any) => `${exp.title}, ${exp.company} (${exp.duration})`),
          projects: (content.projects || []).map((proj: any) => `${proj.name}: ${proj.description}`),
          certifications: content.certifications || [],
          hobbies: content.interests || [],
          linkedInUrl: content.personalInfo?.linkedIn || "",
        });

        toast.success("Resume parsed and form updated!");
      } else {
        throw new Error("Failed to upload resume");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!studentId) {
      toast.warning("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          ...formData,
        }),
      });

      if (response.ok) {
        const newProfile = await response.json();
        console.log("Profile created:", newProfile);

        toast.success("Profile created successfully!");
        // Optionally, redirect or update UI
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (err) {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToArray = (field: keyof typeof formData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setter("");
    }
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>Upload your resume for automatic extraction or fill out the form manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Upload */}
          <div className="space-y-2">
            <Label>Upload Resume (Optional)</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
              }}
            />
          </div>

          {/* Manual Form */}
          <div className="space-y-4">
            {/* Education */}
            <div className="space-y-2">
              <Label>Education</Label>
              <div className="flex gap-2">
                <Input
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Bachelor of Technology, University Name (Year)"
                  onKeyDown={(e) => e.key === "Enter" && addToArray("education", newEducation, setNewEducation)}
                />
                <Button type="button" onClick={() => addToArray("education", newEducation, setNewEducation)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Show education directly from formData */}
              <div className="flex flex-col gap-2">
                {formData.education.map((edu, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={edu}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const updated = [...prev.education];
                          updated[index] = e.target.value;
                          return { ...prev, education: updated };
                        })
                      }
                    />
                    <div className=" cursor-pointer font-bold" onClick={() => removeFromArray("education", index)}>
                      X
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Technical Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyDown={(e) => e.key === "Enter" && addToArray("skills", newSkill, setNewSkill)}
                />
                <Button type="button" onClick={() => addToArray("skills", newSkill, setNewSkill)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    {skill}
                    <div className=" cursor-pointer font-bold" onClick={() => removeFromArray("skills", index)}>
                      X
                    </div>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <Label>Projects</Label>
              <div className="flex gap-2">
                <Input
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="Project description"
                  onKeyDown={(e) => e.key === "Enter" && addToArray("projects", newProject, setNewProject)}
                />
                <Button type="button" onClick={() => addToArray("projects", newProject, setNewProject)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {formData.projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary text-black p-2 rounded">
                    <span className="text-sm">{project}</span>
                    <div className="cursor-pointer font-bold" onClick={() => removeFromArray("projects", index)}>
                      X
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label>Internships/Experience</Label>
              <div className="flex gap-2">
                <Input
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  placeholder="Position, Company (Duration)"
                  onKeyDown={(e) => e.key === "Enter" && addToArray("experience", newExperience, setNewExperience)}
                />
                <Button type="button" onClick={() => addToArray("experience", newExperience, setNewExperience)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary p-2 text-black rounded">
                    <span className="text-sm">{exp}</span>
                    <div className="cursor-pointer font-bold" onClick={() => removeFromArray("experience", index)}>
                      X
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Certification name"
                  onKeyDown={(e) =>
                    e.key === "Enter" && addToArray("certifications", newCertification, setNewCertification)
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToArray("certifications", newCertification, setNewCertification)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                    <div className="cursor-pointer font-bold" onClick={() => removeFromArray("certifications", index)}>
                      X
                    </div>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hobbies */}
            <div className="space-y-2">
              <Label>Hobbies</Label>
              <div className="flex gap-2">
                <Input
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  placeholder="Add a hobby"
                  onKeyDown={(e) => e.key === "Enter" && addToArray("hobbies", newHobby, setNewHobby)}
                />
                <Button type="button" onClick={() => addToArray("hobbies", newHobby, setNewHobby)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.hobbies.map((hobby, index) => (
                  <Badge key={index} variant="secondary">
                    {hobby}
                    <div className="cursor-pointer font-bold" onClick={() => removeFromArray("hobbies", index)}>
                      X
                    </div>
                  </Badge>
                ))}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={formData.linkedInUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedInUrl: e.target.value,
                  }))
                }
                placeholder="https://www.linkedin.com/in/username"
              />
            </div>
          </div>

          {/* Submit */}
          <Button onClick={createProfile} className="w-full" disabled={loading || !studentId}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileCreation;
