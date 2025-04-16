
import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Edit2, Search, Tag, Filter } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  text: string;
  category: string;
  pinned: boolean;
  createdAt: string;
}

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ['general', 'work', 'personal', 'ideas', 'important'];

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Default notes
      const defaultNotes = [
        {
          id: '1',
          text: 'Update wireframes for mobile app',
          category: 'work',
          pinned: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          text: 'Schedule meeting with design team',
          category: 'general',
          pinned: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          text: 'Buy groceries for the week',
          category: 'personal',
          pinned: false,
          createdAt: new Date().toISOString()
        }
      ];
      setNotes(defaultNotes);
      localStorage.setItem('userNotes', JSON.stringify(defaultNotes));
    }
  }, []);

  const addNote = () => {
    if (newNote.trim()) {
      const newNoteItem: Note = {
        id: Date.now().toString(),
        text: newNote,
        category: newCategory,
        pinned: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedNotes = [...notes, newNoteItem];
      setNotes(updatedNotes);
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
      setNewNote('');
      setNewCategory('general');
      setIsAddingNote(false);
      
      toast({
        title: "Note Added",
        description: "Your note has been added successfully",
      });
    }
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Deleted",
      description: "Your note has been removed",
      variant: "destructive",
    });
  };

  const startEditingNote = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
    setEditCategory(note.category);
  };

  const saveEditedNote = () => {
    if (editingId !== null && editText.trim()) {
      const updatedNotes = notes.map(note => 
        note.id === editingId 
          ? { ...note, text: editText, category: editCategory } 
          : note
      );
      
      setNotes(updatedNotes);
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
      setEditingId(null);
      
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully",
      });
    }
  };

  const togglePinNote = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addNote();
      } else {
        saveEditedNote();
      }
    }
  };

  // Fixed filter function with null checks to prevent toLowerCase() on undefined
  const filteredNotes = notes
    .filter(note => {
      // Apply search query filter - Adding null check for text property
      const noteText = note.text || '';
      const searchTerm = searchQuery || '';
      const matchesSearch = noteText.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply category filter - Adding null check for category property
      const noteCategory = note.category || '';
      const matchesCategory = categoryFilter === 'all' || noteCategory === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by pinned status first
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Get unique categories from notes
  const uniqueCategories = Array.from(new Set(notes.filter(note => note.category).map(note => note.category)));

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'work': return 'bg-blue-500';
      case 'personal': return 'bg-green-500';
      case 'ideas': return 'bg-purple-500';
      case 'important': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-projector-darkblue"
          />
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
            onClick={() => setIsAddingNote(true)} 
            className="flex items-center text-sm bg-projector-darkblue text-white px-3 py-2 rounded-md hover:bg-opacity-90"
          >
            <PlusCircle size={16} className="mr-2" /> New Note
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-3 rounded-md mb-3 flex flex-wrap gap-2">
          <button 
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 text-xs rounded-full ${categoryFilter === 'all' ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          
          {uniqueCategories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-full ${categoryFilter === cat ? 'bg-projector-darkblue text-white' : 'bg-gray-200'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {isAddingNote && (
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="Type your note..."
            className="w-full p-2 border border-gray-200 rounded text-sm mb-3"
            autoFocus
          />
          
          <div className="flex justify-between items-center">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="text-sm border border-gray-200 rounded p-1.5"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAddingNote(false)}
                className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={addNote}
                className="text-xs px-3 py-1.5 bg-projector-darkblue text-white rounded hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredNotes.length > 0 ? (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`bg-white p-4 rounded-lg border ${note.pinned ? 'border-projector-orange' : 'border-gray-100'} shadow-sm group transition-all hover:shadow-md`}
            >
              {editingId === note.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="w-full p-2 border border-gray-200 rounded text-sm mb-3"
                    autoFocus
                  />
                  
                  <div className="flex justify-between items-center">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="text-sm border border-gray-200 rounded p-1.5"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={saveEditedNote}
                        className="text-xs px-3 py-1.5 bg-projector-darkblue text-white rounded hover:bg-opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm">{note.text}</p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${getCategoryColor(note.category)}`}></span>
                        <span className="text-xs text-gray-500">{note.category ? note.category.charAt(0).toUpperCase() + note.category.slice(1) : 'General'}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePinNote(note.id)} 
                        className={`p-1 rounded-full mr-1 ${note.pinned ? 'text-projector-orange' : 'text-gray-400 hover:text-gray-600'}`} 
                        title={note.pinned ? "Unpin" : "Pin"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="17" x2="12" y2="3"></line>
                          <path d="M5 17h14v4H5z"></path>
                          <path d="M5 7h14v10H5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => startEditingNote(note)} 
                        className="p-1 rounded-full text-gray-400 hover:text-projector-darkblue mr-1"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteNote(note.id)} 
                        className="p-1 rounded-full text-gray-400 hover:text-red-500" 
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 inline-block p-4 rounded-full mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M14 3v4a1 1 0 001 1h4"></path>
              <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"></path>
              <line x1="9" y1="9" x2="10" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
            </svg>
          </div>
          <p className="text-gray-500 mb-1">No notes found</p>
          <p className="text-gray-400 text-sm">
            {searchQuery || categoryFilter !== 'all' ? 
              'Try adjusting your search or filters' : 
              'Create your first note by clicking "New Note"'}
          </p>
        </div>
      )}
    </div>
  );
};
