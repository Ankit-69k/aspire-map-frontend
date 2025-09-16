"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Map, MessageCircle, Settings, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProfileSection } from "@/components/dashboard/profile-section";
import { LearningRoadmap } from "@/components/dashboard/learning-roadmap";
import { ChatbotInterface } from "@/components/dashboard/chatbot-interface";
import { SettingsPage } from "@/components/dashboard/settings-page";
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

type TabType = "profile" | "roadmap" | "chatbot" | "settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as TabType, label: "Your Profile", icon: User },
    { id: "roadmap" as TabType, label: "Learning Roadmap", icon: Map },
    { id: "chatbot" as TabType, label: "AI Chatbot", icon: MessageCircle },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "roadmap":
        return <LearningRoadmap />;
      case "chatbot":
        return <ChatbotInterface />;
      case "settings":
        return <SettingsPage />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 px-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-lg font-bold font-[var(--font-playfair)]">CareerPath</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} size="lg">
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
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Software Developer</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold font-[var(--font-playfair)]">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-4">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
