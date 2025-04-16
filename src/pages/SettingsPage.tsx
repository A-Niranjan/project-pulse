
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationApp, setNotificationApp] = useState(true);
  const [theme, setTheme] = useState("light");
  const [timeFormat, setTimeFormat] = useState("12h");
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setName(parsedUser.name);
    setEmail(parsedUser.email || "user@example.com");
    
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
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      name,
      email
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Appearance Settings Saved",
      description: "Your appearance settings have been updated",
    });
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-gray-50 p-4 md:p-6">
                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab("account")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "account" ? "bg-projector-darkblue text-white" : "hover:bg-gray-100"}`}
                    >
                      Account
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "notifications" ? "bg-projector-darkblue text-white" : "hover:bg-gray-100"}`}
                    >
                      Notifications
                    </button>
                    <button 
                      onClick={() => setActiveTab("appearance")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "appearance" ? "bg-projector-darkblue text-white" : "hover:bg-gray-100"}`}
                    >
                      Appearance
                    </button>
                    <button 
                      onClick={() => setActiveTab("security")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "security" ? "bg-projector-darkblue text-white" : "hover:bg-gray-100"}`}
                    >
                      Security
                    </button>
                  </nav>
                </div>
                
                <div className="md:w-3/4 p-4 md:p-6">
                  {activeTab === "account" && (
                    <form onSubmit={handleSaveProfile}>
                      <h2 className="text-lg font-medium mb-4">Account Settings</h2>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="avatar">
                          Profile Picture
                        </label>
                        <div className="flex items-center gap-4">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded hover:bg-gray-200"
                          >
                            Change Picture
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-projector-darkblue text-white rounded-lg hover:bg-opacity-90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === "notifications" && (
                    <form onSubmit={handleSaveNotifications}>
                      <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Get emails about activity related to you</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={notificationEmail}
                              onChange={() => setNotificationEmail(!notificationEmail)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-projector-darkblue"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">App Notifications</h3>
                            <p className="text-sm text-gray-500">Show notifications within the app</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={notificationApp}
                              onChange={() => setNotificationApp(!notificationApp)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-projector-darkblue"></div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-projector-darkblue text-white rounded-lg hover:bg-opacity-90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === "appearance" && (
                    <form onSubmit={handleSaveAppearance}>
                      <h2 className="text-lg font-medium mb-4">Appearance Settings</h2>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <div className="flex gap-3">
                          <label className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer ${theme === "light" ? "border-projector-darkblue bg-blue-50" : "border-gray-200"}`}>
                            <input
                              type="radio"
                              name="theme"
                              value="light"
                              checked={theme === "light"}
                              onChange={() => setTheme("light")}
                              className="sr-only"
                            />
                            <div className="w-16 h-10 bg-white border"></div>
                            <span className="text-sm">Light</span>
                          </label>
                          
                          <label className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer ${theme === "dark" ? "border-projector-darkblue bg-blue-50" : "border-gray-200"}`}>
                            <input
                              type="radio"
                              name="theme"
                              value="dark"
                              checked={theme === "dark"}
                              onChange={() => setTheme("dark")}
                              className="sr-only"
                            />
                            <div className="w-16 h-10 bg-gray-800 border"></div>
                            <span className="text-sm">Dark</span>
                          </label>
                          
                          <label className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer ${theme === "system" ? "border-projector-darkblue bg-blue-50" : "border-gray-200"}`}>
                            <input
                              type="radio"
                              name="theme"
                              value="system"
                              checked={theme === "system"}
                              onChange={() => setTheme("system")}
                              className="sr-only"
                            />
                            <div className="w-16 h-10 bg-gradient-to-r from-white to-gray-800 border"></div>
                            <span className="text-sm">System</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Time Format</label>
                        <div className="flex gap-3">
                          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${timeFormat === "12h" ? "border-projector-darkblue bg-blue-50" : "border-gray-200"}`}>
                            <input
                              type="radio"
                              name="timeFormat"
                              value="12h"
                              checked={timeFormat === "12h"}
                              onChange={() => setTimeFormat("12h")}
                              className="sr-only"
                            />
                            <span>12-hour (1:00 PM)</span>
                          </label>
                          
                          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${timeFormat === "24h" ? "border-projector-darkblue bg-blue-50" : "border-gray-200"}`}>
                            <input
                              type="radio"
                              name="timeFormat"
                              value="24h"
                              checked={timeFormat === "24h"}
                              onChange={() => setTimeFormat("24h")}
                              className="sr-only"
                            />
                            <span>24-hour (13:00)</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-projector-darkblue text-white rounded-lg hover:bg-opacity-90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === "security" && (
                    <div>
                      <h2 className="text-lg font-medium mb-4">Security Settings</h2>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Change Password</h3>
                        <form className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1">Current Password</label>
                            <input 
                              type="password"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">New Password</label>
                            <input 
                              type="password"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Confirm Password</label>
                            <input 
                              type="password"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-projector-darkblue text-white rounded-lg hover:bg-opacity-90"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Two-factor authentication will be available soon",
                            });
                          }}
                        >
                          Enable 2FA
                        </button>
                      </div>
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

export default SettingsPage;
