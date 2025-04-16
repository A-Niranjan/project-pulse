
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calendar, Clock, ArrowUp, ArrowDown, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

const StatisticsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showMoreData, setShowMoreData] = useState(false);
  
  // Weekly activity data
  const weeklyData = [
    { name: 'Mon', hours: 6.5 },
    { name: 'Tue', hours: 5.8 },
    { name: 'Wed', hours: 7.2 },
    { name: 'Thu', hours: 8.1 },
    { name: 'Fri', hours: 4.5 },
    { name: 'Sat', hours: 2.3 },
    { name: 'Sun', hours: 0.8 },
  ];
  
  // Monthly activity data
  const monthlyData = [
    { name: 'Week 1', hours: 32.4 },
    { name: 'Week 2', hours: 36.7 },
    { name: 'Week 3', hours: 28.9 },
    { name: 'Week 4', hours: 35.2 },
  ];
  
  // Yearly activity data
  const yearlyData = [
    { name: 'Jan', hours: 120 },
    { name: 'Feb', hours: 115 },
    { name: 'Mar', hours: 130 },
    { name: 'Apr', hours: 135 },
    { name: 'May', hours: 125 },
    { name: 'Jun', hours: 140 },
    { name: 'Jul', hours: 145 },
    { name: 'Aug', hours: 130 },
    { name: 'Sep', hours: 135 },
    { name: 'Oct', hours: 150 },
    { name: 'Nov', hours: 140 },
    { name: 'Dec', hours: 120 },
  ];
  
  // Project distribution data
  const projectData = [
    { name: 'Banking App', value: 35, color: '#8884d8' },
    { name: 'Geological Website', value: 25, color: '#82ca9d' },
    { name: 'Mobile Delivery', value: 20, color: '#ffc658' },
    { name: 'Events Website', value: 15, color: '#ff8042' },
    { name: 'Other', value: 5, color: '#0088FE' },
  ];
  
  // Trend data
  const trendData = [
    { name: 'Week 1', productivity: 65, engagement: 70 },
    { name: 'Week 2', productivity: 68, engagement: 72 },
    { name: 'Week 3', productivity: 75, engagement: 80 },
    { name: 'Week 4', productivity: 85, engagement: 88 },
    { name: 'Week 5', productivity: 80, engagement: 85 },
    { name: 'Week 6', productivity: 85, engagement: 90 },
  ];
  
  // Task completion history data
  const taskHistoryData = [
    { date: 'Mon', completed: 8, total: 10 },
    { date: 'Tue', completed: 6, total: 7 },
    { date: 'Wed', completed: 9, total: 12 },
    { date: 'Thu', completed: 10, total: 10 },
    { date: 'Fri', completed: 5, total: 8 },
    { date: 'Sat', completed: 3, total: 5 },
    { date: 'Sun', completed: 0, total: 2 },
  ];
  
  // Calculate task completion
  const weeklyTasks = taskHistoryData.reduce((acc, day) => acc + day.completed, 0);
  const weeklyTasksTotal = taskHistoryData.reduce((acc, day) => acc + day.total, 0);
  const taskCompletionPercentage = Math.round((weeklyTasks / weeklyTasksTotal) * 100);
  
  // Productivity score breakdown
  const productivityBreakdown = [
    { name: 'Focus Time', score: 90, color: '#8884d8' },
    { name: 'Task Completion', score: 85, color: '#82ca9d' },
    { name: 'Meeting Efficiency', score: 75, color: '#ffc658' },
    { name: 'Collaboration', score: 90, color: '#ff8042' },
  ];
  
  // Current challenges
  const challenges = [
    { name: 'Meeting Overload', status: 'high', actions: 2 },
    { name: 'Context Switching', status: 'medium', actions: 1 },
    { name: 'Email Management', status: 'low', actions: 0 },
  ];

  // Get active data based on selected tab
  const getActiveData = () => {
    switch(activeTab) {
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return weeklyData;
    }
  };
  
  // Calculate total hours from active data
  const totalHours = getActiveData().reduce((total, item) => total + item.hours, 0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Check if mobile device
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Statistics</h1>
            
            {/* Main Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Activity Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-medium text-lg">Activity Overview</h2>
                  <div className="flex rounded-md overflow-hidden border border-gray-200">
                    <button 
                      onClick={() => setActiveTab('weekly')} 
                      className={`text-xs px-3 py-1.5 ${activeTab === 'weekly' ? 'bg-projector-darkblue text-white' : 'bg-white'}`}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setActiveTab('monthly')} 
                      className={`text-xs px-3 py-1.5 ${activeTab === 'monthly' ? 'bg-projector-darkblue text-white' : 'bg-white'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setActiveTab('yearly')} 
                      className={`text-xs px-3 py-1.5 ${activeTab === 'yearly' ? 'bg-projector-darkblue text-white' : 'bg-white'}`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                
                <div className="h-64">
                  <ChartContainer
                    config={{
                      hours: { color: "#8884d8" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getActiveData()}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltipContent labelKey="name" hideIndicator />} />
                        <Bar dataKey="hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5 text-gray-500" />
                    <span>{`Total: ${totalHours.toFixed(1)} hours`}</span>
                  </div>
                  
                  <div className="flex items-center text-green-500">
                    <ArrowUp size={16} className="mr-1" />
                    <span>15% from previous {activeTab}</span>
                  </div>
                </div>
              </div>
              
              {/* Productivity Score */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-medium text-lg mb-5">Productivity Score</h2>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40 mb-4">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="absolute inset-0" style={{ 
                        background: `conic-gradient(#8884d8 85%, #f3f3f3 0)`,
                        borderRadius: "100%"
                      }}></div>
                      <div className="absolute inset-2 bg-white rounded-full"></div>
                      <div className="z-10 flex flex-col items-center">
                        <span className="text-4xl font-bold">85%</span>
                        <span className="text-xs text-gray-500">Excellent</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="font-medium">Great job!</div>
                    <div className="text-sm text-green-500 flex items-center justify-center">
                      <ArrowUp size={14} className="mr-1" />
                      <span>15% above team average</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-2">
                    {productivityBreakdown.map((item, index) => (
                      <div key={index} className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.name}</span>
                          <span>{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${item.score}%`, backgroundColor: item.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Project Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-medium text-lg mb-5">Project Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {projectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {projectData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1 text-xs">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                      <span className="truncate">{entry.name}</span>
                      <span className="ml-auto font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Productivity Trends */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-medium text-lg mb-5">Productivity Trends</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="productivity" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }} 
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Task Completion */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-medium text-lg mb-5">Task Completion</h2>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{weeklyTasks}</div>
                    <div className="text-sm text-gray-500">Tasks completed this week</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weekly Goal ({weeklyTasksTotal})</span>
                    <span>{taskCompletionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        taskCompletionPercentage >= 80 ? 'bg-green-500' : 
                        taskCompletionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${taskCompletionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-3">Completion History</h3>
                  <div className="grid grid-cols-7 gap-1">
                    {taskHistoryData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className={`rounded-md mx-auto w-8 h-1.5 mb-1 ${
                            day.completed === 0 ? 'bg-gray-200' :
                            day.completed === day.total ? 'bg-green-500' :
                            day.completed >= day.total * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <div className="text-xs">{day.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {showMoreData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="font-medium text-lg mb-5">Upcoming Deadlines</h2>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium text-sm">Banking App UI</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar size={12} className="mr-1" />
                        Due in 2 days
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium text-sm">Website Wireframes</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar size={12} className="mr-1" />
                        Due in 4 days
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium text-sm">Client Presentation</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar size={12} className="mr-1" />
                        Due in 1 week
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Improvement Areas */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="font-medium text-lg mb-5">Areas for Improvement</h2>
                  <div className="space-y-3">
                    {challenges.map((challenge, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                        {challenge.status === 'high' ? (
                          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        ) : challenge.status === 'medium' ? (
                          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        
                        <div>
                          <div className="font-medium text-sm">{challenge.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {challenge.actions > 0 ? (
                              `${challenge.actions} recommended action${challenge.actions > 1 ? 's' : ''}`
                            ) : (
                              'Monitoring'
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Team Productivity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="font-medium text-lg mb-5">Team Comparison</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your Score</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-projector-darkblue h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Team Average</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Department Average</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-green-500">
                      You're a top performer in your team!
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-8 mb-4">
              <button 
                onClick={() => setShowMoreData(!showMoreData)} 
                className="text-sm text-projector-darkblue hover:underline flex items-center"
              >
                {showMoreData ? 'Show less insights' : 'Show more insights'}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`ml-1 transition-transform ${showMoreData ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
