
import { useState, useEffect } from "react";
import { Clock, Plus, MoreHorizontal, ChevronDown, Check, Calendar, Timer, Share2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrendingTask {
  id: string;
  platform: string;
  title: string;
  progress: number;
  timeSpent: string;
  assignees: {
    id: string;
    avatarUrl: string;
    name: string;
  }[];
  dueDate?: string;
  description?: string;
}

interface TrendingTasksProps {
  tasks: TrendingTask[];
}

export const TrendingTasks = ({ tasks }: TrendingTasksProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPlatform, setNewTaskPlatform] = useState("Dribbble");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [localTasks, setLocalTasks] = useState<TrendingTask[]>(tasks);
  const [showTaskDetails, setShowTaskDetails] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'title'>('progress');
  
  useEffect(() => {
    localStorage.setItem("trendingTasks", JSON.stringify(localTasks));
  }, [localTasks]);
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }
    
    const userDataString = localStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    
    const newTask: TrendingTask = {
      id: Date.now().toString(),
      platform: newTaskPlatform,
      title: newTaskTitle,
      progress: 0,
      timeSpent: "0:00:00",
      description: newTaskDescription,
      dueDate: newTaskDueDate || undefined,
      assignees: [
        { 
          id: "1", 
          avatarUrl: userData?.avatarUrl || "/uploads/user1.png", 
          name: userData?.name || "Niranjan" 
        }
      ]
    };
    
    setLocalTasks([...localTasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setShowAddTask(false);
    
    toast({
      title: "Task created",
      description: "Your new task has been added to trending",
    });
  };
  
  const updateProgress = (taskId: string, newProgress: number) => {
    setLocalTasks(localTasks.map(task => 
      task.id === taskId ? {...task, progress: newProgress} : task
    ));
    
    toast({
      title: "Progress updated",
      description: `Task progress is now at ${newProgress}%`,
    });
  };
  
  const deleteTask = (taskId: string) => {
    setLocalTasks(localTasks.filter(task => task.id !== taskId));
    setShowTaskDetails(null);
    
    toast({
      title: "Task removed",
      description: "The task has been removed from trending",
      variant: "destructive",
    });
  };
  
  const startTimer = (taskId: string) => {
    toast({
      title: "Timer started",
      description: "Time tracking has started for this task",
    });
  };
  
  const shareTask = (task: TrendingTask) => {
    navigator.clipboard.writeText(`Task: ${task.title} - Progress: ${task.progress}%`);
    
    toast({
      title: "Link copied",
      description: "Task details copied to clipboard for sharing",
    });
  };
  
  const filteredTasks = localTasks
    .filter(task => !filterPlatform || task.platform === filterPlatform)
    .sort((a, b) => {
      if (sortBy === 'progress') {
        return b.progress - a.progress;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } 
      return b.id.localeCompare(a.id);
    });
  
  const platforms = Array.from(new Set(localTasks.map(task => task.platform)));
  
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <span className="text-sm text-gray-500 font-medium">({filteredTasks.length})</span>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={filterPlatform || ''} 
              onChange={(e) => setFilterPlatform(e.target.value || null)} 
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md"
            >
              <option value="">All platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'progress' | 'title')} 
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md"
            >
              <option value="progress">Sort by progress</option>
              <option value="title">Sort by title</option>
              <option value="date">Sort by date</option>
            </select>
          </div>
          
          <Button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      {showAddTask && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">New Trending Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Platform *</label>
              <select
                value={newTaskPlatform}
                onChange={(e) => setNewTaskPlatform(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm"
              >
                <option value="Dribbble">Dribbble</option>
                <option value="Behance">Behance</option>
                <option value="Roman IT Internal">Roman IT Internal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Brief description of the task"
                className="w-full p-2 border border-gray-200 rounded text-sm"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowAddTask(false)}
                variant="ghost" 
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                className="px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90"
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TrendingTaskCard 
            key={task.id} 
            task={task} 
            onProgressUpdate={updateProgress}
            onDelete={deleteTask}
            onViewDetails={(id) => setShowTaskDetails(id)}
            onStartTimer={startTimer}
            onShare={shareTask}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500">
            <div className="inline-block p-3 mb-2 bg-gray-100 rounded-full">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <p>No tasks match your criteria</p>
            <Button 
              onClick={() => {
                setShowAddTask(true);
                setFilterPlatform(null);
              }}
              variant="link"
              className="text-projector-darkblue mt-2"
            >
              Add your first task
            </Button>
          </div>
        )}
      </div>
      
      {showTaskDetails && (
        <TaskDetailsDialog 
          task={localTasks.find(t => t.id === showTaskDetails)!}
          onClose={() => setShowTaskDetails(null)}
          onDelete={deleteTask}
          onProgressUpdate={updateProgress}
        />
      )}
    </div>
  );
};

interface TrendingTaskCardProps {
  task: TrendingTask;
  onProgressUpdate: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onStartTimer: (id: string) => void;
  onShare: (task: TrendingTask) => void;
}

const TrendingTaskCard = ({ 
  task, 
  onProgressUpdate, 
  onDelete, 
  onViewDetails, 
  onStartTimer,
  onShare
}: TrendingTaskCardProps) => {
  const progressColor = getCardColor(task.platform);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  const [progressValue, setProgressValue] = useState(task.progress);
  
  const handleProgressUpdate = () => {
    onProgressUpdate(task.id, progressValue);
    setShowProgressUpdate(false);
  };
  
  return (
    <div className={`task-card h-auto ${progressColor.bg} hover:shadow-md transition-all`}>
      <div className="flex flex-col h-full">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">{task.platform}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal size={16} className="text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white z-50">
              <DropdownMenuItem onClick={() => setShowProgressUpdate(true)}>
                <Check size={14} className="mr-2" />
                Update progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStartTimer(task.id)}>
                <Timer size={14} className="mr-2" />
                Start timer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(task)}>
                <Share2 size={14} className="mr-2" />
                Share task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewDetails(task.id)}>
                <ChevronDown size={14} className="mr-2" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)} 
                className="text-red-600"
              >
                <X size={14} className="mr-2" />
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{task.title}</h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        {showProgressUpdate ? (
          <div className="my-3">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(parseInt(e.target.value))}
                className="w-full accent-projector-darkblue"
              />
              <span className="font-semibold">{progressValue}%</span>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setShowProgressUpdate(false)}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleProgressUpdate}
                className="px-2 py-1 text-xs bg-projector-darkblue text-white rounded hover:bg-opacity-90 flex items-center gap-1"
              >
                <Check size={12} />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 mb-3">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-between items-end">
          <div className="flex items-center -space-x-2">
            {task.assignees.map((assignee) => (
              <img
                key={assignee.id}
                src={assignee.avatarUrl}
                alt={assignee.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={assignee.name}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock size={14} /> 
            <span>{task.timeSpent}</span>
          </div>
        </div>
        
        {task.dueDate && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100 pt-2">
            <Calendar size={12} />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to safely format dates
function formatDate(dateString: string): string {
  try {
    // Check if the date is valid before processing
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
}

interface TaskDetailsDialogProps {
  task: TrendingTask;
  onClose: () => void;
  onDelete: (id: string) => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const TaskDetailsDialog = ({ task, onClose, onDelete, onProgressUpdate }: TaskDetailsDialogProps) => {
  const [progressValue, setProgressValue] = useState(task.progress);
  
  const handleProgressUpdate = () => {
    onProgressUpdate(task.id, progressValue);
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{task.platform}</span>
            <span className="text-sm text-gray-500">{task.timeSpent} spent</span>
          </div>
          
          {task.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-gray-700">{task.description}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1">Progress</h4>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(parseInt(e.target.value))}
                className="w-full accent-projector-darkblue"
              />
              <span className="font-semibold">{progressValue}%</span>
            </div>
            
            <Button 
              onClick={handleProgressUpdate}
              className="mt-2 text-xs bg-projector-darkblue text-white"
              size="sm"
            >
              Update Progress
            </Button>
          </div>
          
          {task.dueDate && (
            <div>
              <h4 className="text-sm font-medium mb-1">Due Date</h4>
              <p className="text-sm text-gray-700">{formatDate(task.dueDate)}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1">Assignees</h4>
            <div className="flex flex-wrap gap-2">
              {task.assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                  <img
                    src={assignee.avatarUrl}
                    alt={assignee.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{assignee.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t pt-4">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
          >
            Delete Task
          </Button>
          
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getCardColor(platform: string) {
  switch (platform.toLowerCase()) {
    case 'dribbble':
      return {
        bg: 'bg-projector-pink bg-opacity-30',
      };
    case 'behance':
      return {
        bg: 'bg-projector-lime bg-opacity-30',
      };
    case 'roman it internal':
      return {
        bg: 'bg-blue-50',
      };
    default:
      return {
        bg: 'bg-white',
      };
  }
}
