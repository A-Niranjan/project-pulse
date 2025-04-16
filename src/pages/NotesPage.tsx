
import { useState, useEffect } from "react";
import { Notes } from "@/components/Notes";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const NotesPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Notes</h1>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Notes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
