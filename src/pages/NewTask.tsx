import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, LinkIcon, PlusCircle, Users } from "lucide-react";

const NewTask = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "Dribbble",
    dueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    priority: "Medium",
    assignees: [] as string[]
  });
  
  useEffect(() => {
    // Add current user as default assignee
    if (user) {
      setFormData(prev => ({
        ...prev,
        assignees: [user.name]
      }));
    }
  }, [user]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get existing tasks or initialize empty array
      const existingTasksJson = localStorage.getItem("tasks");
      const existingTasks = existingTasksJson ? JSON.parse(existingTasksJson) : [];
      
      // Calculate due time (24 hours from now by default)
      const now = new Date();
      const dueHours = 24;
      const dueTimeMs = now.getTime() + (dueHours * 60 * 60 * 1000);
      const dueTime = `${dueHours}:00:00`;
      
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        platform: formData.platform,
        title: formData.title,
        progress: 0, // Start at 0%
        dueTime: dueTime,
        assignees: [
          { 
            id: user.name, 
            avatarUrl: user.avatarUrl,
            name: user.name 
          }
        ],
        description: formData.description,
        priority: formData.priority,
        createdAt: new Date().toISOString()
      };
      
      // Add to existing tasks
      const updatedTasks = [...existingTasks, newTask];
      
      // Save to localStorage
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      
      // Dispatch event to notify Dashboard component
      const taskCreatedEvent = new CustomEvent("taskCreated", {
        detail: { task: newTask }
      });
      document.dispatchEvent(taskCreatedEvent);
      
      // Record activity
      const activityEvent = new CustomEvent("projectActivity", {
        detail: { 
          activity: {
            user: {
              name: user.name,
              avatarUrl: user.avatarUrl
            },
            action: "created task",
            target: formData.title
          }
        }
      });
      document.dispatchEvent(activityEvent);
      
      toast({
        title: "Task created",
        description: "Your task has been added to your lineup.",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Could not create the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-projector-ivory">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username={user.name} 
          avatarUrl={user.avatarUrl}
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold">Create New Task</h1>
              <p className="text-gray-500">Add a new task to your lineup</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="title">
                    Task Title
                  </label>
                  <Input 
                    id="title"
                    name="title"
                    placeholder="Enter task title" 
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="description">
                    Description
                  </label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Describe the task in detail" 
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="platform">
                      Platform
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="Dribbble">Dribbble</option>
                      <option value="Behance">Behance</option>
                      <option value="Roman IT Internal">Roman IT Internal</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Figma">Figma</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="dueDate">
                      Due Date
                    </label>
                    <div className="relative">
                      <Input 
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10"
                      />
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="priority">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Users size={16} className="mr-2" />
                    Assignees
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="bg-projector-darkblue text-white px-3 py-1.5 rounded-full text-sm flex items-center">
                      {user.name}
                      <button type="button" className="ml-2 hover:text-gray-200">×</button>
                    </div>
                    <button 
                      type="button"
                      className="text-projector-darkblue hover:text-opacity-80 inline-flex items-center text-sm"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Assignee
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <LinkIcon size={16} className="mr-2" />
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <PlusCircle size={32} className="mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Drag and drop files here, or click to select files</p>
                      <input type="file" className="hidden" multiple />
                      <button 
                        type="button"
                        className="mt-4 text-projector-darkblue hover:underline text-sm font-medium"
                      >
                        Select Files
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify" />
                  <label
                    htmlFor="notify"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Notify team members
                  </label>
                </div>
                
                <div className="pt-4 flex items-center justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-projector-darkblue hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        Creating Task...
                      </div>
                    ) : (
                      "Create Task"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
