"use client";

import { useState } from "react";
import { LogOut, FolderKanban, Sparkles, Briefcase, FileText, Mail } from "lucide-react";
import { useAuth } from "./AuthContext";
import ProjectsManager from "./ProjectsManager";
import SkillsManager from "./SkillsManager";
import ExperienceManager from "./ExperienceManager";
import SiteContentManager from "./SiteContentManager";
import MessagesManager from "./MessagesManager";

const TABS = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "skills", label: "Skills", icon: Sparkles },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "content", label: "Site content", icon: FileText },
  { key: "messages", label: "Messages", icon: Mail },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-void">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-signal">
              Dev by Manan
            </p>
            <h1 className="font-display text-xl text-ink">Admin dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-signal hover:text-signal"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-content gap-1 overflow-x-auto px-6 md:px-10">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-signal text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-content px-6 py-10 md:px-10">
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "content" && <SiteContentManager />}
        {activeTab === "messages" && <MessagesManager />}
      </main>
    </div>
  );
}
