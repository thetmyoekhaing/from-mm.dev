"use client";

import { useState } from "react";

type Tab = "subdomains" | "profile" | "projects";

export default function DashboardTabs({
  subdomains,
  profile,
  projects,
}: {
  subdomains: React.ReactNode;
  profile: React.ReactNode;
  projects: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("subdomains");

  return (
    <div className="flex flex-col gap-6">
      <div className="-mb-2 flex items-center gap-4 overflow-x-auto border-b border-zinc-200 pb-px scrollbar-hide dark:border-zinc-800">
        <TabButton 
          isActive={activeTab === "subdomains"} 
          onClick={() => setActiveTab("subdomains")}
        >
          Subdomains
        </TabButton>
        <TabButton 
          isActive={activeTab === "profile"} 
          onClick={() => setActiveTab("profile")}
        >
          Developer profile
        </TabButton>
        <TabButton 
          isActive={activeTab === "projects"} 
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </TabButton>
      </div>

      <div className="pt-2">
        {activeTab === "subdomains" && subdomains}
        {activeTab === "profile" && profile}
        {activeTab === "projects" && projects}
      </div>
    </div>
  );
}

function TabButton({ 
  isActive, 
  onClick, 
  children 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-1 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        isActive
          ? "border-green-600 text-zinc-900 dark:text-zinc-50"
          : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}
