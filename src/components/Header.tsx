
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, Settings, Bell, User, Menu, LogOut, Calendar, MessageCircle, BarChart2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  username: string;
  avatarUrl: string;
  toggleSidebar: () => void;
}

export const Header = ({ username, avatarUrl, toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(10);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"`,
      });
      // In a real app, this would perform a search
      console.log("Searching for:", searchQuery);
    }
  };
  
  const handleSettings = () => {
    navigate("/settings");
    setShowUserMenu(false);
    setShowNotifications(false);
  };
  
  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications && notificationCount > 0) {
      setNotificationCount(0);
    }
  };
  
  const handleAgendaClick = () => {
    navigate("/agenda");
    setShowMobileMenu(false);
  };
  
  const handleMentionsClick = () => {
    navigate("/mentions");
    setShowMobileMenu(false);
  };
  
  const handleStatisticsClick = () => {
    navigate("/statistics");
    setShowMobileMenu(false);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    // Close notifications if opening user menu
    if (!showUserMenu && showNotifications) {
      setShowNotifications(false);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    // Close other menus
    setShowUserMenu(false);
    setShowNotifications(false);
  };
  
  const navigateToProfile = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
    });
    navigate("/login");
  };
  
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-6 bg-white shadow-sm z-20 relative">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 text-gray-600 hover:text-gray-800"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <form className="relative w-full md:w-72" onSubmit={handleSearch}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-projector-darkblue focus:border-projector-darkblue"
            placeholder="Search"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <button 
          className="md:hidden text-gray-600 hover:text-gray-800"
          onClick={toggleMobileMenu}
          aria-label="Mobile menu"
        >
          <Menu size={20} />
        </button>
        
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-full right-0 left-0 mt-1 bg-white border-t border-gray-100 shadow-md z-30 md:hidden animate-fade-in"
          >
            <div className="p-2">
              <button 
                onClick={handleAgendaClick}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-projector-darkblue hover:text-white rounded-md transition-colors"
              >
                <Calendar size={18} />
                <span>Agenda</span>
              </button>
              <button 
                onClick={handleMentionsClick}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-projector-darkblue hover:text-white rounded-md transition-colors"
              >
                <MessageCircle size={18} />
                <span>Mentions</span>
                {notificationCount > 0 && (
                  <span className="bg-projector-darkblue text-white text-xs py-0.5 px-2 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button 
                onClick={handleStatisticsClick}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-projector-darkblue hover:text-white rounded-md transition-colors"
              >
                <BarChart2 size={18} />
                <span>Statistics</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="hidden md:flex space-x-2">
          <button 
            className="px-4 py-2 font-medium hover:bg-projector-darkblue hover:text-white rounded-lg transition-colors"
            onClick={handleAgendaClick}
          >
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Agenda</span>
            </span>
          </button>
          <button 
            className="px-4 py-2 font-medium hover:bg-projector-darkblue hover:text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleMentionsClick}
          >
            <MessageCircle size={16} />
            <span>Mentions</span>
            {notificationCount > 0 && (
              <span className="bg-projector-darkblue text-white text-xs py-0.5 px-2 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          <button 
            className="px-4 py-2 font-medium hover:bg-projector-darkblue hover:text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleStatisticsClick}
          >
            <BarChart2 size={16} />
            <span>Statistics</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="text-gray-600 hover:text-gray-800 relative p-1 rounded-full hover:bg-gray-100"
            onClick={handleSettings}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          
          <div className="relative" ref={notificationsRef}>
            <button 
              className="text-gray-600 hover:text-gray-800 relative p-1 rounded-full hover:bg-gray-100"
              onClick={handleNotifications}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg py-2 z-30 animate-scale-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium">New task assigned</p>
                      <p className="text-xs text-gray-500">Alex assigned you to "Mobile app design"</p>
                      <p className="text-xs text-gray-400 mt-1">{5 - i} hour{i !== 4 ? 's' : ''} ago</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-sm text-projector-darkblue hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center gap-2"
              onClick={toggleUserMenu}
              aria-label="User menu"
            >
              <span className="hidden md:inline font-medium">{username}</span>
              <img
                src={avatarUrl}
                alt={username}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-1 z-30 animate-scale-in">
                <button 
                  onClick={navigateToProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <button 
                  onClick={handleSettings}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
                <div className="md:hidden">
                  <button 
                    onClick={handleAgendaClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Calendar size={16} className="mr-2" />
                    Agenda
                  </button>
                  <button 
                    onClick={handleMentionsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Mentions
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-projector-darkblue text-white text-xs py-0.5 px-2 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={handleStatisticsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BarChart2 size={16} className="mr-2" />
                    Statistics
                  </button>
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
