import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, X, Edit2, Users, Clock, MapPin } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  duration: string;
  location?: string;
  participants: string[];
}

const AgendaPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formParticipants, setFormParticipants] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    const savedEvents = localStorage.getItem('userEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      const today = new Date();
      const todayStr = formatDateForStorage(today);
      
      const defaultEvents = [
        { id: "1", title: "Team Meeting", time: "10:00", date: todayStr, duration: "1 hour", location: "Conference Room A", participants: ["Alex", "Emma", "John"] },
        { id: "2", title: "Project Review", time: "14:00", date: todayStr, duration: "45 min", location: "Zoom Call", participants: ["Emma", "Robert"] },
        { id: "3", title: "Client Call", time: "16:30", date: todayStr, duration: "30 min", location: "Phone", participants: ["You"] }
      ];
      
      setEvents(defaultEvents);
      localStorage.setItem('userEvents', JSON.stringify(defaultEvents));
    }
    
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setIsLoading(false);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const filteredEvents = events.filter(event => {
    if (!date) return false;
    return event.date === formatDateForStorage(date);
  }).sort((a, b) => {
    const timeA = a.time.replace(':', '');
    const timeB = b.time.replace(':', '');
    return parseInt(timeA) - parseInt(timeB);
  });
  
  const startAddEvent = () => {
    setIsAddingEvent(true);
    setEditingEvent(null);
    
    setFormTitle('');
    setFormTime('');
    setFormDuration('');
    setFormLocation('');
    setFormParticipants('');
  };
  
  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddingEvent(false);
    
    setFormTitle(event.title);
    setFormTime(event.time);
    setFormDuration(event.duration);
    setFormLocation(event.location || '');
    setFormParticipants(event.participants.join(', '));
  };
  
  const addEvent = () => {
    if (!formTitle.trim() || !formTime.trim() || !formDuration.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "No Date Selected",
        description: "Please select a date for the event",
        variant: "destructive",
      });
      return;
    }
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formTitle,
      time: formTime,
      date: formatDateForStorage(date),
      duration: formDuration,
      location: formLocation,
      participants: formParticipants.split(',').map(p => p.trim()).filter(Boolean)
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('userEvents', JSON.stringify(updatedEvents));
    
    setIsAddingEvent(false);
    setFormTitle('');
    setFormTime('');
    setFormDuration('');
    setFormLocation('');
    setFormParticipants('');
    
    toast({
      title: "Event Added",
      description: `${newEvent.title} has been added to your agenda`,
    });
  };
  
  const updateEvent = () => {
    if (!editingEvent) return;
    
    if (!formTitle.trim() || !formTime.trim() || !formDuration.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const updatedEvents = events.map(event => {
      if (event.id === editingEvent.id) {
        return {
          ...event,
          title: formTitle,
          time: formTime,
          duration: formDuration,
          location: formLocation,
          participants: formParticipants.split(',').map(p => p.trim()).filter(Boolean)
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    localStorage.setItem('userEvents', JSON.stringify(updatedEvents));
    
    setEditingEvent(null);
    setFormTitle('');
    setFormTime('');
    setFormDuration('');
    setFormLocation('');
    setFormParticipants('');
    
    toast({
      title: "Event Updated",
      description: `${formTitle} has been updated`,
    });
  };
  
  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('userEvents', JSON.stringify(updatedEvents));
    
    if (editingEvent?.id === eventId) {
      setEditingEvent(null);
      setFormTitle('');
      setFormTime('');
      setFormDuration('');
      setFormLocation('');
      setFormParticipants('');
    }
    
    toast({
      title: "Event Deleted",
      description: `${eventToDelete?.title || 'Event'} has been removed from your agenda`,
      variant: "destructive",
    });
  };
  
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${minutes || '00'} ${suffix}`;
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-projector-ivory">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-transparent border-projector-darkblue rounded-full animate-spin mb-4"></div>
          <p className="text-projector-darkblue font-medium">Loading...</p>
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
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Agenda</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-medium mb-4">Calendar</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                />
                
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-3">Upcoming Events</h3>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {events
                      .filter(event => new Date(event.date) >= new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="border-l-2 border-projector-darkblue pl-2 py-1 text-sm">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })} at {formatTimeDisplay(event.time)}
                          </div>
                        </div>
                      ))}
                    
                    {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        No upcoming events
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-medium">Events for {date ? formatDate(date) : 'Selected Date'}</h2>
                  <button 
                    onClick={startAddEvent} 
                    className="text-sm text-projector-darkblue font-medium hover:underline flex items-center"
                  >
                    <PlusCircle size={16} className="mr-1" /> Add Event
                  </button>
                </div>
                
                {isAddingEvent && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">New Event</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Event title"
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Time *</label>
                          <input
                            type="time"
                            value={formTime}
                            onChange={(e) => setFormTime(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Duration *</label>
                          <input
                            type="text"
                            value={formDuration}
                            onChange={(e) => setFormDuration(e.target.value)}
                            placeholder="e.g., 30 min, 1 hour"
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="Meeting room, Zoom link, etc."
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Participants</label>
                        <input
                          type="text"
                          value={formParticipants}
                          onChange={(e) => setFormParticipants(e.target.value)}
                          placeholder="Comma separated names"
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Separate names with commas</span>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          onClick={() => setIsAddingEvent(false)} 
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={addEvent} 
                          className="px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90"
                        >
                          Add Event
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {editingEvent && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">Edit Event</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Event title"
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Time *</label>
                          <input
                            type="time"
                            value={formTime}
                            onChange={(e) => setFormTime(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Duration *</label>
                          <input
                            type="text"
                            value={formDuration}
                            onChange={(e) => setFormDuration(e.target.value)}
                            placeholder="e.g., 30 min, 1 hour"
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="Meeting room, Zoom link, etc."
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Participants</label>
                        <input
                          type="text"
                          value={formParticipants}
                          onChange={(e) => setFormParticipants(e.target.value)}
                          placeholder="Comma separated names"
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Separate names with commas</span>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <button 
                          onClick={() => deleteEvent(editingEvent.id)} 
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                        >
                          <X size={14} className="mr-1" /> Delete
                        </button>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingEvent(null)} 
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={updateEvent} 
                            className="px-3 py-1.5 text-sm bg-projector-darkblue text-white rounded hover:bg-opacity-90"
                          >
                            Update Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <div key={event.id} className="border-l-4 border-projector-darkblue pl-4 py-3 bg-gray-50 rounded-r-md hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                              {formatTimeDisplay(event.time)}
                            </span>
                            <button 
                              onClick={() => startEditEvent(event)} 
                              className="ml-2 p-1 text-gray-400 hover:text-projector-darkblue rounded-full"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">{event.duration}</div>
                        
                        {event.location && (
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MapPin size={14} className="mr-1" />
                            {event.location}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2 gap-1">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-600 mr-1">With:</span>
                          {event.participants.map((participant, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="bg-gray-100 inline-block p-4 rounded-full mb-3">
                        <Calendar size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-2">No events for this day</p>
                      <button 
                        onClick={startAddEvent}
                        className="text-sm text-projector-darkblue hover:underline inline-flex items-center"
                      >
                        <PlusCircle size={16} className="mr-1" /> Add your first event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
