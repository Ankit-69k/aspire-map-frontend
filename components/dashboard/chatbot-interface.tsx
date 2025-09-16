"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Lightbulb, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI career assistant. I can help you with career advice, skill recommendations, job search tips, and more. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickQuestions = [
    "What skills should I learn next?",
    "How can I improve my resume?",
    "What are good interview tips?",
    "How to negotiate salary?",
    "Best practices for networking?",
    "How to switch careers?",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (question: string): string => {
    const responses = {
      skills:
        "Based on your profile as a Software Developer, I recommend focusing on these skills: Advanced React patterns, TypeScript, Node.js with Express, and cloud platforms like AWS. These align with current market demands and your career goals.",
      resume:
        "Here are key tips for your resume: 1) Quantify your achievements with numbers, 2) Use action verbs like 'developed', 'implemented', 'optimized', 3) Tailor it to each job application, 4) Keep it concise (1-2 pages), 5) Include relevant projects and technologies.",
      interview:
        "Great interview tips: 1) Research the company thoroughly, 2) Practice coding problems on platforms like LeetCode, 3) Prepare STAR method examples for behavioral questions, 4) Ask thoughtful questions about the role and team, 5) Follow up with a thank-you email.",
      salary:
        "Salary negotiation tips: 1) Research market rates using sites like Glassdoor, 2) Consider the total compensation package, 3) Wait for them to make the first offer, 4) Be prepared to justify your ask with achievements, 5) Practice your negotiation conversation beforehand.",
      networking:
        "Effective networking strategies: 1) Attend tech meetups and conferences, 2) Engage on LinkedIn with thoughtful comments, 3) Contribute to open source projects, 4) Join professional communities like Stack Overflow, 5) Offer help before asking for favors.",
      career:
        "Career switching advice: 1) Identify transferable skills from your current role, 2) Build a portfolio showcasing relevant projects, 3) Consider taking courses or certifications, 4) Network with people in your target field, 5) Start with informational interviews to learn more.",
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("skill")) return responses.skills;
    if (lowerQuestion.includes("resume")) return responses.resume;
    if (lowerQuestion.includes("interview")) return responses.interview;
    if (lowerQuestion.includes("salary") || lowerQuestion.includes("negotiate")) return responses.salary;
    if (lowerQuestion.includes("network")) return responses.networking;
    if (lowerQuestion.includes("career") || lowerQuestion.includes("switch")) return responses.career;

    return "That's a great question! I can help you with career advice, skill development, job search strategies, interview preparation, and more. Could you be more specific about what aspect of your career you'd like to discuss?";
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-[var(--font-playfair)] flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          AI Career Assistant
        </h1>
        <p className="text-muted-foreground mt-2">Get personalized career advice and guidance powered by AI</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Quick Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5" />
              Quick Questions
            </CardTitle>
            <CardDescription>Click on any question to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3 text-sm bg-transparent"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto max-h-96 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your career..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
