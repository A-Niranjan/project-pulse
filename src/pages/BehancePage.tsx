import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const designs = [
  {
    id: 1,
    title: "Mobile Banking App Case Study",
    thumbnail: "/uploads/dur1.png",
    author: "Niranjan",
    likes: 342,
    views: 5789,
    tags: ["UI/UX", "Mobile", "Banking"]
  },
  {
    id: 2,
    title: "E-commerce Website Redesign",
    thumbnail: "/uploads/dur2.png",
    author: "Emily Wong",
    likes: 278,
    views: 4321,
    tags: ["Website", "UI", "Redesign"]
  },
  {
    id: 3,
    title: "Travel App Design Concept",
    thumbnail: "/uploads/due3.png",
    author: "Alex Johnson",
    likes: 512,
    views: 7234,
    tags: ["App Design", "Travel", "UX"]
  },
  {
    id: 4,
    title: "Landing Page for SaaS Product",
    thumbnail: "/uploads/dur4.png",
    author: "Sarah Lee",
    likes: 189,
    views: 2987,
    tags: ["UI", "SaaS", "Product"]
  },
  {
    id: 5,
    title: "Fitness Tracker Mobile App",
    thumbnail: "/uploads/dur5.png",
    author: "David Kim",
    likes: 456,
    views: 6123,
    tags: ["Mobile App", "Fitness", "UI"]
  },
  {
    id: 6,
    title: "Online Education Platform",
    thumbnail: "/uploads/dur6.png",
    author: "Megan Chen",
    likes: 321,
    views: 4890,
    tags: ["Education", "Web", "Design"]
  },
];

const BehancePage = () => {
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

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Check if mobile device
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

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
          <p className="text-projector-darkblue font-medium">Loading Behance...</p>
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
          <h1 className="text-2xl font-bold mb-4">Behance Designs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={design.thumbnail} alt={design.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{design.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">By {design.author}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="mr-2"><b>Likes:</b> {design.likes}</span>
                      <span><b>Views:</b> {design.views}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      {design.tags.map((tag, index) => (
                        <span key={index} className="mr-2">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehancePage;
