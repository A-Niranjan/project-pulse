
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const MentionsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mentions, setMentions] = useState<any[]>([
    {
      id: 1,
      author: "Alex Morgan",
      avatarUrl: "https://i.pravatar.cc/150?u=you",
      content: "Hey @Niranjan, can you review the latest design files I uploaded?",
      project: "Banking App",
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Emily Wong",
      avatarUrl: "https://i.pravatar.cc/150?u=james",
      content: "@Niranjan I need your feedback on the typography choices for the homepage.",
      project: "Geological Website",
      time: "Yesterday"
    },
    {
      id: 3,
      author: "James Wilson",
      avatarUrl: "https://i.pravatar.cc/150?u=system",
      content: "Let's schedule a meeting tomorrow @Niranjan to discuss the user flow.",
      project: "Mobile Delivery App",
      time: "2 days ago"
    }
  ]);

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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mentions</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              {mentions.length > 0 ? (
                <div className="space-y-6">
                  {mentions.map(mention => (
                    <div key={mention.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <img src={mention.avatarUrl} alt={mention.author} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{mention.author}</h3>
                            <span className="text-xs text-gray-500">{mention.time}</span>
                          </div>
                          <p className="mt-1 text-sm">{mention.content}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{mention.project}</span>
                            <div className="flex gap-2">
                              <button className="text-xs text-projector-darkblue hover:underline">Reply</button>
                              <button className="text-xs text-gray-500 hover:underline">View Context</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You have no mentions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionsPage;
