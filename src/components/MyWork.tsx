
import { useState, useEffect } from "react";
import { ChevronRight, MoreHorizontal, Plus, Clock, Users, X, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface WorkItem {
  id: string;
  path: string;
  title: string;
  progress: string;
  date: string;
  description?: string;
  assignees: {
    id: string;
    avatarUrl: string;
    name?: string;
  }[];
  tags?: {
    text: string;
    color: string;
  }[];
}

interface MyWorkProps {
  items: WorkItem[];
}

export const MyWork = ({ items: initialItems }: MyWorkProps) => {
  const [items, setItems] = useState<WorkItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WorkItem>>({
    path: "Projects / New",
    title: "",
    progress: "0/10",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    description: "",
    assignees: [],
    tags: []
  });
  
  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem("workItems", JSON.stringify(items));
  }, [items]);
  
  const handleAddItem = () => {
    if (!newItem.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your work item",
        variant: "destructive"
      });
      return;
    }
    
    // Get current user
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    
    const itemToAdd: WorkItem = {
      id: Date.now().toString(),
      path: newItem.path || "Projects / New",
      title: newItem.title,
      progress: newItem.progress || "0/10",
      date: newItem.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      description: newItem.description,
      assignees: [
        {
          id: "1",
          avatarUrl: user?.avatarUrl || "/uploads/6653e968-d824-406d-a044-035175d60980.png",
          name: user?.name || "Niranjan"
        }
      ],
      tags: newItem.tags || []
    };
    
    setItems([...items, itemToAdd]);
    setNewItem({
      path: "Projects / New",
      title: "",
      progress: "0/10",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      description: "",
      assignees: [],
      tags: []
    });
    setShowAddForm(false);
    
    toast({
      title: "Work item created",
      description: "New work item added to your list",
    });
  };
  
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    
    toast({
      title: "Work item removed",
      description: "The item has been removed from your work list",
      variant: "destructive",
    });
  };
  
  const updateProgress = (id: string, newProgress: string) => {
    setItems(items.map(item => 
      item.id === id ? {...item, progress: newProgress} : item
    ));
    
    if (selectedItem?.id === id) {
      setSelectedItem({...selectedItem, progress: newProgress});
    }
    
    toast({
      title: "Progress updated",
      description: `Work item progress updated to ${newProgress}`,
    });
  };
  
  const addTag = (id: string, tagText: string, tagColor: string = "bg-blue-200 text-blue-800") => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const existingTags = item.tags || [];
        return {
          ...item,
          tags: [...existingTags, { text: tagText, color: tagColor }]
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    if (selectedItem?.id === id) {
      const existingTags = selectedItem.tags || [];
      setSelectedItem({
        ...selectedItem,
        tags: [...existingTags, { text: tagText, color: tagColor }]
      });
    }
    
    toast({
      title: "Tag added",
      description: `Added "${tagText}" tag to work item`,
    });
  };
  
  const removeTag = (itemId: string, tagIndex: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId && item.tags) {
        const newTags = [...item.tags];
        newTags.splice(tagIndex, 1);
        return { ...item, tags: newTags };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    if (selectedItem?.id === itemId && selectedItem.tags) {
      const newTags = [...selectedItem.tags];
      newTags.splice(tagIndex, 1);
      setSelectedItem({ ...selectedItem, tags: newTags });
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Work</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90 flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Work</span>
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">New Work Item</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Path</label>
              <input
                type="text"
                value={newItem.path}
                onChange={(e) => setNewItem({...newItem, path: e.target.value})}
                placeholder="Category / Type / Project"
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="Work title"
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Brief description"
                className="w-full p-2 border border-gray-200 rounded text-sm"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Progress</label>
                <input
                  type="text"
                  value={newItem.progress}
                  onChange={(e) => setNewItem({...newItem, progress: e.target.value})}
                  placeholder="e.g., 0/10"
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input
                  type="text"
                  value={newItem.date}
                  onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                  placeholder="e.g., July 22"
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => setShowAddForm(false)}
                variant="ghost" 
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem}
                className="px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90"
              >
                Add Work Item
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="inline-block p-3 mb-3 bg-gray-100 rounded-full">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-3">You don't have any work items yet</p>
          <Button 
            onClick={() => setShowAddForm(true)}
            variant="link"
            className="text-projector-darkblue"
          >
            <Plus size={16} className="mr-1" />
            Add your first work item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 mb-1">{item.path}</div>
                <div className="flex items-center gap-1">
                  {item.tags?.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`${tag.color} text-xs px-2 py-0.5 rounded-full`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{item.title}</h3>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{item.progress}</span>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                
                <div className="flex">
                  {item.assignees.map((assignee) => (
                    <img
                      key={assignee.id}
                      src={assignee.avatarUrl}
                      alt={assignee.name || "User"}
                      className="w-6 h-6 rounded-full -ml-1 border border-white"
                      title={assignee.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedItem && (
        <Dialog open onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="text-sm text-gray-500">{selectedItem.path}</div>
              
              {selectedItem.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-700">{selectedItem.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-1">Progress</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedItem.progress}
                    onChange={(e) => updateProgress(selectedItem.id, e.target.value)}
                    className="border border-gray-200 rounded p-1 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Date</h4>
                <p className="text-sm text-gray-700">{selectedItem.date}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Assignees</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                      <img
                        src={assignee.avatarUrl}
                        alt={assignee.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{assignee.name || "User"}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto py-1"
                    onClick={() => {
                      const tagText = prompt("Enter tag text:");
                      if (tagText) {
                        const colors = [
                          "bg-blue-200 text-blue-800",
                          "bg-green-200 text-green-800",
                          "bg-red-200 text-red-800",
                          "bg-purple-200 text-purple-800",
                          "bg-yellow-200 text-yellow-800"
                        ];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        addTag(selectedItem.id, tagText, randomColor);
                      }
                    }}
                  >
                    <Plus size={14} className="mr-1" />
                    <span className="text-xs">Add Tag</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.tags?.map((tag, index) => (
                    <div 
                      key={index} 
                      className={`${tag.color} text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}
                    >
                      <span>{tag.text}</span>
                      <button onClick={() => removeTag(selectedItem.id, index)} className="hover:text-gray-800">
                        <X size={12} />
                      </button>
                    </div>
                  )) || <span className="text-sm text-gray-500">No tags</span>}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t pt-4">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  deleteItem(selectedItem.id);
                  setSelectedItem(null);
                }}
              >
                Delete Item
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
