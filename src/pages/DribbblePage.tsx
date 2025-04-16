import React, { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Download, Filter, Search, ChevronDown, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FilterOption {
  id: number;
  label: string;
  value: string;
}

const filterOptions: FilterOption[] = [
  { id: 1, label: "Popular", value: "popular" },
  { id: 2, label: "Recent", value: "recent" },
  { id: 3, label: "Trending", value: "trending" },
  { id: 4, label: "Most Commented", value: "mostCommented" },
];

interface Tag {
  id: number;
  label: string;
  value: string;
}

const tags: Tag[] = [
  { id: 1, label: "Mobile", value: "mobile" },
  { id: 2, label: "Web", value: "web" },
  { id: 3, label: "Illustration", value: "illustration" },
  { id: 4, label: "Animation", value: "animation" },
  { id: 5, label: "Branding", value: "branding" },
];

interface Shot {
  id: number;
  title: string;
  imageUrl: string;
  author: string;
  authorAvatar: string;
  likes: number;
  views: number;
  comments: number;
  tags: string[];
  description?: string;
}

const mockData: Shot[] = [
  {
    id: 1,
    title: "Banking App Dashboard",
    imageUrl: "/uploads/dur7.png",
    author: "Niranjan",
    authorAvatar: "https://i.pravatar.cc/150?u=you",
    likes: 423,
    views: 5280,
    comments: 28,
    tags: ["Mobile", "UI Design", "Banking"]
  },
  {
    id: 2,
    title: "E-commerce Website Design",
    imageUrl: "/uploads/durr1.png",
    author: "Emily Wong",
    authorAvatar: "https://i.pravatar.cc/150?u=james",
    likes: 367,
    views: 4892,
    comments: 15,
    tags: ["Web", "E-commerce", "Redesign"]
  },
  {
    id: 3,
    title: "Illustration Set for Startup",
    imageUrl: "/uploads/duee2.png",
    author: "Alex Johnson",
    authorAvatar: "https://i.pravatar.cc/150?u=alex",
    likes: 298,
    views: 3765,
    comments: 8,
    tags: ["Illustration", "Startup", "Branding"]
  },
  {
    id: 4,
    title: "Animated Icon Pack",
    imageUrl: "/uploads/durr2.png",
    author: "Sarah Lee",
    authorAvatar: "https://i.pravatar.cc/150?u=system",
    likes: 512,
    views: 6123,
    comments: 32,
    tags: ["Animation", "Icon", "UI/UX"]
  },
  {
    id: 5,
    title: "Mobile Banking App Case Study",
    imageUrl: "/uploads/dur8.png",
    author: "Niranjan",
    authorAvatar: "https://i.pravatar.cc/150?u=you",
    likes: 342,
    views: 5789,
    comments: 18,
    tags: ["UI/UX", "Mobile", "Banking"]
  },
  {
    id: 6,
    title: "E-commerce Website Redesign",
    imageUrl: "/uploads/dur9.png",
    author: "Emily Wong",
    authorAvatar: "https://i.pravatar.cc/150?u=james",
    likes: 278,
    views: 4321,
    comments: 12,
    tags: ["Website", "E-commerce", "Redesign"]
  },
];

const DribbblePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shots, setShots] = useState<Shot[]>(mockData);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterValue: string) => {
    setSelectedFilter(filterValue);
  };

  const handleTagSelect = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagValue));
    } else {
      setSelectedTags([...selectedTags, tagValue]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilter(null);
    setSelectedTags([]);
    toast({
      title: "Filters cleared",
      description: "All filters have been reset.",
    });
  };

  const filteredShots = shots.filter((shot) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const matchesSearch = searchRegex.test(shot.title) || searchRegex.test(shot.author);
    const matchesFilter = selectedFilter ? selectedFilter === "popular" : true;
    const matchesTags = selectedTags.length > 0 ? shot.tags.some((tag) => selectedTags.includes(tag)) : true;

    return matchesSearch && matchesFilter && matchesTags;
  });

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
            <h1 className="text-2xl font-bold mb-6">Dribbble</h1>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <div className="flex items-center mb-3 md:mb-0">
                <div className="relative mr-3">
                  <input
                    type="text"
                    placeholder="Search shots..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-projector-darkblue"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedFilter || ""}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-projector-darkblue"
                  >
                    <option value="">Filter by</option>
                    {filterOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelect(tag.value)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.value)
                      ? "bg-projector-darkblue text-white"
                      : "bg-gray-200 text-gray-700"
                      } hover:bg-projector-darkblue hover:text-white transition-colors duration-200`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShots.length > 0 ? (
                filteredShots.map((shot) => (
                  <div key={shot.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={shot.imageUrl} alt={shot.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{shot.title}</h3>
                      <div className="flex items-center mb-3">
                        <img src={shot.authorAvatar} alt={shot.author} className="w-8 h-8 rounded-full mr-2" />
                        <span className="text-sm text-gray-600">{shot.author}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{shot.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{shot.views}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{shot.comments}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {shot.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No shots found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DribbblePage;
