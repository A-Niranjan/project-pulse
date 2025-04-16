
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Greeting } from "@/components/Greeting";
import { TaskList } from "@/components/TaskList";
import { TrendingTasks } from "@/components/TrendingTasks";
import { MyWork } from "@/components/MyWork";
import { StatsCards } from "@/components/StatsCards";
import { toast } from "@/hooks/use-toast";
import { Notes } from "@/components/Notes";
import { Goals } from "@/components/Goals";
import { Activity } from "@/components/Activity";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [trendingTasks, setTrendingTasks] = useState<any[]>([]);
  const [workItems, setWorkItems] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load data from localStorage or use mock data if none exists
    loadTaskData();
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Show welcome toast
    toast({
      title: `Welcome back, ${parsedUser.name.split(" ")[0]}!`,
      description: "Your tasks and statistics are ready for review",
    });

    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);
  
  const loadTaskData = () => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
        setDefaultTasks();
      }
    } else {
      setDefaultTasks();
    }
    
    // Load trending tasks
    const savedTrendingTasks = localStorage.getItem("trendingTasks");
    if (savedTrendingTasks) {
      try {
        setTrendingTasks(JSON.parse(savedTrendingTasks));
      } catch (error) {
        console.error("Error parsing trending tasks:", error);
        setDefaultTrendingTasks();
      }
    } else {
      setDefaultTrendingTasks();
    }
    
    // Load work items
    const savedWorkItems = localStorage.getItem("workItems");
    if (savedWorkItems) {
      try {
        setWorkItems(JSON.parse(savedWorkItems));
      } catch (error) {
        console.error("Error parsing work items:", error);
        setDefaultWorkItems();
      }
    } else {
      setDefaultWorkItems();
    }
  };
  
  const setDefaultTasks = () => {
    // Use mock data if no saved tasks
    const mockTasks = [
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
          { id: "3", avatarUrl: "https://i.pravatar.cc/150?u=james", name: "Emily Wong" },
        ],
      },
    ];
    setTasks(mockTasks);
    localStorage.setItem("tasks", JSON.stringify(mockTasks));
  };
  
  const setDefaultTrendingTasks = () => {
    const mockTrending = [
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
    setTrendingTasks(mockTrending);
    localStorage.setItem("trendingTasks", JSON.stringify(mockTrending));
  };
  
  const setDefaultWorkItems = () => {
    const mockWork = [
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
          { id: "1", avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png" },
          { id: "2", avatarUrl: "https://i.pravatar.cc/150?u=james" },
        ],
        tags: [
          { text: "3", color: "bg-green-200 text-green-800" },
        ],
      },
    ];
    setWorkItems(mockWork);
    localStorage.setItem("workItems", JSON.stringify(mockWork));
  };
  
  const handleAddTask = () => {
    navigate("/new-task");
  };

  const updateTaskList = useCallback((newTask: any) => {
    setTasks(prev => {
      const updatedTasks = [...prev, newTask];
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);
  
  // Update state when tasks are modified or deleted
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        try {
          setTasks(JSON.parse(updatedTasks));
        } catch (error) {
          console.error("Error parsing updated tasks:", error);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Listen to custom event for task creation
    const handleTaskCreation = (event: any) => {
      if (event.detail && event.detail.task) {
        updateTaskList(event.detail.task);
      }
    };
    
    document.addEventListener("taskCreated", handleTaskCreation);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("taskCreated", handleTaskCreation);
    };
  }, [updateTaskList]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-projector-ivory">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-transparent border-projector-darkblue rounded-full animate-spin mb-4"></div>
          <p className="text-projector-darkblue font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-projector-ivory">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30`}>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username={user.name} 
          avatarUrl={user.avatarUrl} 
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row px-4 py-4 md:px-6 md:py-6">
            <div className="flex-1 md:pr-6">
              <Greeting username={user.name.split(" ")[0]} />
              
              <TaskList 
                title="LineUp" 
                count={tasks.length} 
                tasks={tasks} 
                onAddTask={handleAddTask} 
              />
              
              <TrendingTasks tasks={trendingTasks} />
              
              <MyWork items={workItems} />
            </div>
            
            <div className="w-full md:w-80 mt-6 md:mt-0">
              <StatsCards />
              <div className="mt-6">
                <Notes />
              </div>
              <Goals />
              <Activity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
