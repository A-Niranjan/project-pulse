
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Greeting } from "@/components/Greeting";
import { TaskList } from "@/components/TaskList";
import { TrendingTasks } from "@/components/TrendingTasks";
import { MyWork } from "@/components/MyWork";
import { StatsCards } from "@/components/StatsCards";
import { toast } from "@/hooks/use-toast";

// Mock data for profile
const profile = {
  name: "Niranjan",
  avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png",
};

// Mock data for tasks
const lineUpTasks = [
  {
    id: "1",
    platform: "Dribbble",
    title: "Banking app shot",
    progress: 43,
    dueTime: "23:00:57",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png", name: "Niranjan" },
    ],
  },
  {
    id: "2",
    platform: "Behance",
    title: "Geological website case",
    progress: 67,
    dueTime: "16:20:32",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png", name: "Niranjan" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/150?u=alex", name: "Alex Johnson" },
      { id: "3", avatarUrl: "https://i.pravatar.cc/150?u=system", name: "Emily Wong" },
    ],
  },
];

// Mock data for trending tasks
const trendingTasks = [
  {
    id: "1",
    platform: "Dribbble",
    title: "Banking App Animation",
    progress: 12,
    timeSpent: "10:48:14",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png", name: "Niranjan" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/150?u=alex", name: "Alex Johnson" },
    ],
  },
  {
    id: "2",
    platform: "Behance",
    title: "AI chat app case",
    progress: 36,
    timeSpent: "6:30:43",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png", name: "Niranjan" },
    ],
  },
  {
    id: "3",
    platform: "Roman IT Internal",
    title: "Logotype design",
    progress: 98,
    timeSpent: "24:05:09",
    assignees: [
      { id: "3", avatarUrl: "https://i.pravatar.cc/150?u=james", name: "Emily Wong" },
    ],
  },
];

// Mock data for work items
const workItems = [
  {
    id: "1",
    path: "Publications / Shots / Dribbble",
    title: "Dribbble: Banking app shot",
    progress: "3/10",
    date: "July 22",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/150?u=alex" },
      { id: "3", avatarUrl: "https://i.pravatar.cc/150?u=james" },
    ],
  },
  {
    id: "2",
    path: "Publications / Shots / Behance",
    title: "Behance: Mobile delivery app",
    progress: "1/8",
    date: "July 24",
    assignees: [
      { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/150?u=james" },
    ],
  },
  {
    id: "3",
    path: "Internal / Events / Design",
    title: "Event: User research methods",
    progress: "2/14",
    date: "July 26",
    assignees: [
      { id: "1", avatarUrl: "https://i.pravatar.cc/150?u=james" },
      { id: "2", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png" },
    ],
    tags: [
      { text: "3", color: "bg-green-200 text-green-800" },
    ],
  },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Show welcome toast when the app first loads
    toast({
      title: "Welcome back, Niranjan!",
      description: "You have 15 tasks to do today",
    });
  }, []);

  const handleAddTask = () => {
    toast({
      title: "Create new task",
      description: "Task creation feature will be available soon!",
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-projector-ivory">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username={profile.name} 
          avatarUrl={profile.avatarUrl} 
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="flex px-6 py-6">
            <div className="flex-1 pr-6">
              <Greeting username={profile.name.split(" ")[0]} />
              
              <TaskList 
                title="LineUp" 
                count={2} 
                tasks={lineUpTasks} 
                onAddTask={handleAddTask} 
              />
              
              <TrendingTasks tasks={trendingTasks} />
              
              <MyWork items={workItems} />
            </div>
            
            <div className="w-80">
              <StatsCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
