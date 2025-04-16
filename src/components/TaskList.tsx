
import { PlusCircle, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Task {
  id: string;
  platform: string;
  title: string;
  progress: number;
  dueTime: string;
  assignees: {
    id: string;
    avatarUrl: string;
    name: string;
  }[];
}

interface TaskListProps {
  title: string;
  count: number;
  tasks: Task[];
  onAddTask?: () => void;
}

export const TaskList = ({ title, count, tasks, onAddTask }: TaskListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleDeleteTask = (taskId: string) => {
    // Get existing tasks
    const tasksJson = localStorage.getItem("tasks");
    if (!tasksJson) return;
    
    const existingTasks = JSON.parse(tasksJson);
    const taskToDelete = existingTasks.find((t: Task) => t.id === taskId);
    
    // Filter out the task to delete
    const updatedTasks = existingTasks.filter((t: Task) => t.id !== taskId);
    
    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    
    // Create custom event to update dashboard
    const updateEvent = new CustomEvent("storage");
    window.dispatchEvent(updateEvent);
    
    // Record the activity
    if (taskToDelete) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        
        const activityEvent = new CustomEvent("projectActivity", {
          detail: { 
            activity: {
              user: {
                name: user.name,
                avatarUrl: user.avatarUrl
              },
              action: "deleted task",
              target: taskToDelete.title
            }
          }
        });
        document.dispatchEvent(activityEvent);
      }
    }
    
    // Show toast
    toast({
      title: "Task deleted",
      description: "The task has been removed from your lineup."
    });
  };
  
  const updateTaskProgress = (taskId: string, newProgress: number) => {
    // Get existing tasks
    const tasksJson = localStorage.getItem("tasks");
    if (!tasksJson) return;
    
    const existingTasks = JSON.parse(tasksJson);
    
    // Update the specific task
    const updatedTasks = existingTasks.map((task: Task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, progress: newProgress };
        return updatedTask;
      }
      return task;
    });
    
    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    
    // Create custom event to update dashboard
    const updateEvent = new CustomEvent("storage");
    window.dispatchEvent(updateEvent);
    
    // Record the activity if progress is 100%
    if (newProgress === 100) {
      const taskToComplete = existingTasks.find((t: Task) => t.id === taskId);
      if (taskToComplete) {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          
          const activityEvent = new CustomEvent("projectActivity", {
            detail: { 
              activity: {
                user: {
                  name: user.name,
                  avatarUrl: user.avatarUrl
                },
                action: "completed",
                target: taskToComplete.title
              }
            }
          });
          document.dispatchEvent(activityEvent);
        }
      }
    }
    
    // Show toast
    toast({
      title: `Progress updated`,
      description: `Task progress set to ${newProgress}%`
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <span className="text-sm text-gray-500 font-medium">({count})</span>
        </div>
        <div className="flex gap-2">
          <button 
            className={`p-2 ${viewMode === 'list' ? 'bg-projector-darkblue text-white' : 'bg-white'} rounded-lg border hover:bg-opacity-90`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <button 
            className={`p-2 ${viewMode === 'grid' ? 'bg-projector-darkblue text-white' : 'bg-white'} rounded-lg border hover:bg-opacity-90`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
              onProgressUpdate={updateTaskProgress}
            />
          ))}
          
          <button
            onClick={onAddTask}
            className="border rounded-2xl p-4 h-48 bg-white hover:bg-gray-50 flex flex-col items-center justify-center"
          >
            <PlusCircle size={24} className="mb-2" />
            <span>Add Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskListItem 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
              onProgressUpdate={updateTaskProgress}
            />
          ))}
          
          <button
            onClick={onAddTask}
            className="border rounded-lg p-4 w-full bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Add Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const TaskCard = ({ task, onDelete, onProgressUpdate }: TaskCardProps) => {
  const progressValue = task.progress;
  const progressColor = getProgressColor(progressValue);
  
  const [isHovered, setIsHovered] = useState(false);
  
  const handleProgressClick = () => {
    // Cycle through progress values: 0 → 25 → 50 → 75 → 100
    let newProgress = Math.ceil(progressValue / 25) * 25;
    if (newProgress <= progressValue) {
      newProgress += 25;
    }
    if (newProgress > 100) {
      newProgress = 0;
    }
    
    onProgressUpdate(task.id, newProgress);
  };
  
  return (
    <div 
      className="task-card h-48 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <span className="text-sm text-gray-500">{task.platform}</span>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{task.title}</h3>
        </div>
        
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
          
          <div 
            className={cn("text-3xl font-bold cursor-pointer", progressColor.text)}
            style={{ 
              "--progress": `${progressValue}%` 
            } as React.CSSProperties}
            onClick={handleProgressClick}
            title="Click to update progress"
          >
            {progressValue}%
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock size={14} /> 
            <span className="text-sm">{task.dueTime}</span>
          </div>
          
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskListItem = ({ task, onDelete, onProgressUpdate }: TaskCardProps) => {
  const progressValue = task.progress;
  const progressColor = getProgressColor(progressValue);
  
  const handleProgressClick = () => {
    // Cycle through progress values: 0 → 25 → 50 → 75 → 100
    let newProgress = Math.ceil(progressValue / 25) * 25;
    if (newProgress <= progressValue) {
      newProgress += 25;
    }
    if (newProgress > 100) {
      newProgress = 0;
    }
    
    onProgressUpdate(task.id, newProgress);
  };
  
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded">{task.platform}</span>
            <h3 className="font-medium ml-2">{task.title}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2">
            {task.assignees.map((assignee) => (
              <img
                key={assignee.id}
                src={assignee.avatarUrl}
                alt={assignee.name}
                className="w-6 h-6 rounded-full border-2 border-white"
                title={assignee.name}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-500" /> 
            <span className="text-sm text-gray-500">{task.dueTime}</span>
          </div>
          
          <div 
            className={cn("text-xl font-bold cursor-pointer", progressColor.text)}
            onClick={handleProgressClick}
            title="Click to update progress"
          >
            {progressValue}%
          </div>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

function getProgressColor(value: number) {
  if (value < 30) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-600',
    };
  } else if (value < 70) {
    return {
      bg: 'bg-projector-lime bg-opacity-20',
      text: 'text-projector-lime',
    };
  } else {
    return {
      bg: 'bg-green-100',
      text: 'text-green-600',
    };
  }
}
