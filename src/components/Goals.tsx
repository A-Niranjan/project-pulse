import { useState, useEffect } from 'react';
import { CheckCircle, Circle, PlusCircle, X, Edit2, Calendar, Clock, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  category: string;
  createdAt: string;
}

export const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newCategory, setNewCategory] = useState('personal');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [editCategory, setEditCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ['personal', 'work', 'health', 'education', 'finance'];

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Default goals with enhanced data
      const defaultGoals = [
        { 
          id: '1', 
          text: 'Complete project proposal', 
          completed: true,
          priority: 'high' as const,
          dueDate: '2025-04-20',
          category: 'work',
          createdAt: '2025-04-10T10:30:00Z'
        },
        { 
          id: '2', 
          text: 'Review design feedback', 
          completed: false,
          priority: 'medium' as const,
          dueDate: '2025-04-18',
          category: 'work',
          createdAt: '2025-04-11T14:20:00Z'
        },
        { 
          id: '3', 
          text: 'Prepare for client meeting', 
          completed: false,
          priority: 'high' as const,
          dueDate: '2025-04-16',
          category: 'work',
          createdAt: '2025-04-12T09:15:00Z'
        },
        { 
          id: '4', 
          text: 'Daily exercise routine', 
          completed: false,
          priority: 'low' as const,
          dueDate: null,
          category: 'health',
          createdAt: '2025-04-13T08:45:00Z'
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('userGoals', JSON.stringify(defaultGoals));
    }
  }, []);

  const toggleGoal = (id: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const newStatus = !goal.completed;
        // Show toast for completion status change
        toast({
          title: newStatus ? "Goal Completed" : "Goal Reopened",
          description: goal.text,
          variant: "default",
        });
        return { ...goal, completed: newStatus };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const newGoalItem: Goal = {
        id: Date.now().toString(),
        text: newGoal,
        completed: false,
        priority: newPriority,
        dueDate: newDueDate || null,
        category: newCategory,
        createdAt: new Date().toISOString()
      };
      const updatedGoals = [...goals, newGoalItem];
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      
      // Reset form
      setNewGoal('');
      setNewPriority('medium');
      setNewDueDate('');
      setNewCategory('personal');
      setIsAddingGoal(false);
      
      toast({
        title: "Goal Added",
        description: "New goal has been added successfully",
      });
    }
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find(goal => goal.id === id);
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    
    toast({
      title: "Goal Deleted",
      description: goalToDelete?.text || "Goal has been removed",
      variant: "destructive",
    });
  };

  const startEditingGoal = (goal: Goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
    setEditPriority(goal.priority);
    setEditDueDate(goal.dueDate || '');
    setEditCategory(goal.category);
  };

  const saveEditedGoal = () => {
    if (editingId && editText.trim()) {
      const updatedGoals = goals.map(goal => 
        goal.id === editingId 
          ? { 
              ...goal, 
              text: editText, 
              priority: editPriority,
              dueDate: editDueDate || null,
              category: editCategory
            } 
          : goal
      );
      
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      setEditingId(null);
      
      toast({
        title: "Goal Updated",
        description: "Your goal has been updated successfully",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addGoal();
      } else {
        saveEditedGoal();
      }
    }
  };

  // Filter and sort goals
  const filteredAndSortedGoals = goals
    .filter(goal => {
      // Filter by status
      if (filterStatus === 'active' && goal.completed) return false;
      if (filterStatus === 'completed' && !goal.completed) return false;
      
      // Filter by priority
      if (filterPriority !== 'all' && goal.priority !== filterPriority) return false;
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      // Sort by selected criteria
      if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        comparison = priorityValues[a.priority] - priorityValues[b.priority];
      } else if (sortBy === 'dueDate') {
        // Handle null due dates (put them at the end)
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Calculate completion percentage
  const completedCount = goals.filter(goal => goal.completed).length;
  const totalCount = goals.length;
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } 
    
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  };
  
  // Calculate how many days until due
  const getDaysUntilDue = (dateString: string | null) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    
    // Reset time part for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-gray-100 h-2 rounded-full overflow-hidden w-32 mr-3">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                completionPercentage > 66 ? 'bg-green-500' : 
                completionPercentage > 33 ? 'bg-yellow-500' : 'bg-projector-darkblue'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="flex items-center text-sm text-projector-darkblue hover:bg-gray-100 px-3 py-2 rounded-md"
          >
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          
          <button 
            onClick={() => setIsAddingGoal(true)} 
            className="flex items-center text-sm bg-projector-darkblue text-white px-3 py-2 rounded-md hover:bg-opacity-90"
          >
            <PlusCircle size={16} className="mr-2" /> New Goal
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-3 rounded-md mb-3">
          <div className="flex flex-wrap gap-3 mb-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <div className="flex gap-1">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-1 text-xs rounded ${filterStatus === 'all' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterStatus('active')}
                  className={`px-2 py-1 text-xs rounded ${filterStatus === 'active' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setFilterStatus('completed')}
                  className={`px-2 py-1 text-xs rounded ${filterStatus === 'completed' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
                >
                  Completed
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <div className="flex gap-1">
                <button 
                  onClick={() => setFilterPriority('all')}
                  className={`px-2 py-1 text-xs rounded ${filterPriority === 'all' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterPriority('high')}
                  className={`px-2 py-1 text-xs rounded ${filterPriority === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                  High
                </button>
                <button 
                  onClick={() => setFilterPriority('medium')}
                  className={`px-2 py-1 text-xs rounded ${filterPriority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setFilterPriority('low')}
                  className={`px-2 py-1 text-xs rounded ${filterPriority === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  Low
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sort By</label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  setSortBy('dueDate');
                  if (sortBy === 'dueDate') toggleSortDirection();
                }}
                className={`flex items-center px-2 py-1 text-xs rounded ${sortBy === 'dueDate' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
              >
                Due Date
                {sortBy === 'dueDate' && (
                  sortDirection === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />
                )}
              </button>
              <button 
                onClick={() => {
                  setSortBy('priority');
                  if (sortBy === 'priority') toggleSortDirection();
                }}
                className={`flex items-center px-2 py-1 text-xs rounded ${sortBy === 'priority' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
              >
                Priority
                {sortBy === 'priority' && (
                  sortDirection === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />
                )}
              </button>
              <button 
                onClick={() => {
                  setSortBy('createdAt');
                  if (sortBy === 'createdAt') toggleSortDirection();
                }}
                className={`flex items-center px-2 py-1 text-xs rounded ${sortBy === 'createdAt' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
              >
                Created
                {sortBy === 'createdAt' && (
                  sortDirection === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isAddingGoal && (
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="Type your goal..."
            className="w-full p-2 border border-gray-200 rounded text-sm mb-3"
            autoFocus
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full text-sm border border-gray-200 rounded p-1.5"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded p-1.5"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded p-1.5"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsAddingGoal(false)}
              className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={addGoal}
              className="text-xs px-3 py-1.5 bg-projector-darkblue text-white rounded hover:bg-opacity-90"
            >
              Save Goal
            </button>
          </div>
        </div>
      )}
      
      {filteredAndSortedGoals.length > 0 ? (
        <div className="space-y-2">
          {filteredAndSortedGoals.map((goal) => (
            <div 
              key={goal.id} 
              className={`bg-white p-3 rounded-lg border border-gray-100 shadow-sm ${goal.completed ? 'bg-gray-50' : ''} group transition-all hover:shadow-md`}
            >
              {editingId === goal.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                    autoFocus
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Priority</label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full text-sm border border-gray-200 rounded p-1.5"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded p-1.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded p-1.5"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveEditedGoal}
                      className="text-xs px-3 py-1.5 bg-projector-darkblue text-white rounded hover:bg-opacity-90"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {goal.completed ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                  </button>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${goal.completed ? 'line-through text-gray-400' : ''}`}>{goal.text}</p>
                      
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button 
                          onClick={() => startEditingGoal(goal)}
                          className="p-1 rounded-full text-gray-400 hover:text-projector-darkblue"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center mt-1.5 gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${getPriorityColor(goal.priority)} text-white`}>
                        {goal.priority}
                      </span>
                      
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(goal.dueDate)}
                      </span>
                      
                      {goal.dueDate && !goal.completed && (
                        <span className={`inline-flex items-center text-xs ${
                          getDaysUntilDue(goal.dueDate) === 'Overdue' ? 'text-red-500' : 
                          getDaysUntilDue(goal.dueDate) === 'Due today' ? 'text-orange-500' : 'text-gray-500'
                        }`}>
                          <Clock size={12} className="mr-1" />
                          {getDaysUntilDue(goal.dueDate)}
                        </span>
                      )}
                      
                      <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {goal.category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 inline-block p-4 rounded-full mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4l3 3"></path>
            </svg>
          </div>
          <p className="text-gray-500 mb-1">No goals found</p>
          <p className="text-gray-400 text-sm">
            {filterStatus !== 'all' || filterPriority !== 'all' ? 
              'Try adjusting your filters' : 
              'Create your first goal by clicking "New Goal"'}
          </p>
        </div>
      )}
    </div>
  );
};
