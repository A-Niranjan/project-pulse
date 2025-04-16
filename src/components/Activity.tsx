
import { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, FileText, User, BarChart2, Target } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'note' | 'goal' | 'task' | 'meeting' | 'analytics';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

export const Activity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Simulate loading activities from storage or API
    const loadActivities = () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'note',
          title: 'Note created',
          description: 'Created a new note: "Update wireframes for mobile app"',
          timestamp: now.toISOString(),
          user: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex'
          }
        },
        {
          id: '2',
          type: 'goal',
          title: 'Goal completed',
          description: 'Completed goal: "Complete project proposal"',
          timestamp: now.toISOString(),
          user: {
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?u=you'
          }
        },
        {
          id: '3',
          type: 'meeting',
          title: 'Meeting scheduled',
          description: 'Team meeting scheduled for tomorrow at 10:00 AM',
          timestamp: yesterday.toISOString(),
          user: {
            name: 'Emma Watson',
            avatar: 'https://i.pravatar.cc/150?u=emma'
          }
        },
        {
          id: '4',
          type: 'task',
          title: 'Task assigned',
          description: 'You were assigned to "Design new landing page"',
          timestamp: yesterday.toISOString(),
          user: {
            name: 'James Smith',
            avatar: 'https://i.pravatar.cc/150?u=james'
          }
        },
        {
          id: '5',
          type: 'analytics',
          title: 'Weekly report',
          description: 'Your productivity increased by 15% this week',
          timestamp: twoDaysAgo.toISOString(),
          user: {
            name: 'System',
            avatar: 'https://i.pravatar.cc/150?u=system'
          }
        },
        {
          id: '6',
          type: 'note',
          title: 'Note updated',
          description: 'Updated note: "Schedule meeting with design team"',
          timestamp: twoDaysAgo.toISOString(),
          user: {
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?u=you'
          }
        }
      ];
      
      // Store in localStorage for persistence
      localStorage.setItem('userActivity', JSON.stringify(mockActivities));
      
      return mockActivities;
    };
    
    setTimeout(() => {
      const savedActivities = localStorage.getItem('userActivity');
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      } else {
        const newActivities = loadActivities();
        setActivities(newActivities);
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);
  
  // Filter activities based on selected filter
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups: Record<string, ActivityItem[]>, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(activity);
    return groups;
  }, {});
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Check if today
  const isToday = (date: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return date === today;
  };
  
  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText size={16} className="text-blue-500" />;
      case 'goal':
        return <Target size={16} className="text-green-500" />;
      case 'task':
        return <Calendar size={16} className="text-purple-500" />;
      case 'meeting':
        return <User size={16} className="text-orange-500" />;
      case 'analytics':
        return <BarChart2 size={16} className="text-projector-darkblue" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-8 w-8 border-4 border-t-transparent border-projector-darkblue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Activity Feed</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded p-1"
          >
            <option value="all">All Activities</option>
            <option value="note">Notes</option>
            <option value="goal">Goals</option>
            <option value="task">Tasks</option>
            <option value="meeting">Meetings</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
      </div>
      
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => (
          <div key={date} className="mb-6">
            <div className="sticky top-0 bg-projector-ivory py-2 z-10">
              <h3 className="text-sm font-medium text-gray-500">
                {isToday(date) ? 'Today' : date}
              </h3>
            </div>
            
            <div className="space-y-3">
              {groupedActivities[date].map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-white rounded-lg shadow-sm p-3 flex items-start gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    
                    <div className="flex items-center mt-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden mr-1.5">
                        <img src={activity.user.avatar} alt={activity.user.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-500">{activity.user.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 inline-block p-4 rounded-full mb-3">
            <Clock size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-1">No activities found</p>
          <p className="text-gray-400 text-sm">
            {filter !== 'all' ? 
              `No ${filter} activities found. Try selecting a different filter.` : 
              'Your activity feed is empty'}
          </p>
        </div>
      )}
    </div>
  );
};
