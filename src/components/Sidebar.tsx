
import { 
  HomeIcon, 
  FileTextIcon, 
  TargetIcon, 
  ActivityIcon, 
  FolderIcon, 
  BarChart3Icon,
  StarIcon,
  PlusIcon,
  CalendarIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    publications: true, // Start with Publications expanded
    commercial: false,
    internal: false,
    docs: false,
    dashboards: false,
    favorites: false
  });
  
  // Show space creation dialog
  const [showNewSpace, setShowNewSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceSection, setNewSpaceSection] = useState("publications");
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate("/login");
  };
  
  const handleCreateNewSpace = () => {
    if (!newSpaceName.trim()) {
      toast({
        title: "Space name required",
        description: "Please enter a name for your new space",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Space created",
      description: `New ${newSpaceSection} space "${newSpaceName}" has been created`
    });
    
    setNewSpaceName("");
    setShowNewSpace(false);
  };
  
  const handleAddToSection = (section: string) => {
    setNewSpaceSection(section);
    setShowNewSpace(true);
  };

  return (
    <aside className={cn("w-64 px-4 py-6 border-r bg-projector-ivory h-full overflow-y-auto", className)}>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-projector-orange rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        </div>
        <span className="text-xl font-semibold">Project Pulse</span>
      </div>

      <nav className="space-y-1 mb-6">
        <NavItem 
          icon={<HomeIcon size={20} />} 
          label="Home" 
          to="/dashboard" 
          active={currentPath === '/dashboard'} 
        />
        <NavItem 
          icon={<FileTextIcon size={20} />} 
          label="Notes" 
          to="/notes" 
          active={currentPath === '/notes'} 
        />
        <NavItem 
          icon={<TargetIcon size={20} />} 
          label="Goals" 
          to="/goals" 
          active={currentPath === '/goals'} 
        />
        <NavItem 
          icon={<ActivityIcon size={20} />} 
          label="Activity" 
          to="/activity" 
          active={currentPath === '/activity'} 
        />
        <NavItem 
          icon={<CalendarIcon size={20} />} 
          label="Agenda" 
          to="/agenda" 
          active={currentPath === '/agenda'} 
        />
        <NavItem 
          icon={<MessageSquareIcon size={20} />} 
          label="Mentions" 
          to="/mentions" 
          active={currentPath === '/mentions'} 
        />
        <NavItem 
          icon={<BarChart3Icon size={20} />} 
          label="Statistics" 
          to="/statistics" 
          active={currentPath === '/statistics'} 
        />
        <NavItem 
          icon={<SettingsIcon size={20} />} 
          label="Settings" 
          to="/settings" 
          active={currentPath === '/settings'} 
        />
      </nav>

      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Spaces</span>
          <button 
            className="text-gray-500 hover:text-gray-800"
            onClick={() => handleAddToSection('publications')}
          >
            <PlusIcon size={16} />
          </button>
        </div>
        <nav className="space-y-1">
          <NavItemWithSubmenu 
            icon={<FolderIcon size={20} />} 
            label="Publications" 
            active={expandedSections.publications} 
            onToggle={() => toggleSection('publications')}
            addItem={() => handleAddToSection('publications')}
            items={[
              { name: 'Dribbble', color: 'bg-projector-lime', path: '/dribbble' },
              { name: 'Behance', color: 'bg-projector-orange', path: '/behance' },
            ]}
            currentPath={currentPath}
          />
          <NavItemWithSubmenu 
            icon={<FolderIcon size={20} />} 
            label="Commercial" 
            active={expandedSections.commercial} 
            onToggle={() => toggleSection('commercial')}
            addItem={() => handleAddToSection('commercial')}
          />
          <NavItemWithSubmenu 
            icon={<FolderIcon size={20} />} 
            label="Internal" 
            active={expandedSections.internal} 
            onToggle={() => toggleSection('internal')}
            addItem={() => handleAddToSection('internal')}
          />
        </nav>
      </div>

      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Docs</span>
          <button 
            className="text-gray-500 hover:text-gray-800"
            onClick={() => handleAddToSection('docs')}
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Dashboards</span>
          <button 
            className="text-gray-500 hover:text-gray-800"
            onClick={() => handleAddToSection('dashboards')}
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Favorites</span>
          <button 
            className="text-gray-500 hover:text-gray-800"
            onClick={() => handleAddToSection('favorites')}
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button 
          onClick={() => setShowNewSpace(true)}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-projector-darkblue text-white rounded-lg hover:bg-opacity-90"
        >
          <PlusIcon size={18} />
          <span>New Space</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full mt-4 py-2 px-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      
      {/* New Space Dialog */}
      {showNewSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <h3 className="text-lg font-medium mb-4">Create New Space</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Space Name</label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Enter space name"
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Section</label>
                <select
                  value={newSpaceSection}
                  onChange={(e) => setNewSpaceSection(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                >
                  <option value="publications">Publications</option>
                  <option value="commercial">Commercial</option>
                  <option value="internal">Internal</option>
                  <option value="docs">Docs</option>
                  <option value="dashboards">Dashboards</option>
                  <option value="favorites">Favorites</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowNewSpace(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateNewSpace}
                  className="px-4 py-2 bg-projector-darkblue text-white rounded hover:bg-opacity-90"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to: string;
}

const NavItem = ({ icon, label, active, to }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg",
        active ? "bg-projector-darkblue text-white" : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface NavItemWithSubmenuProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onToggle: () => void;
  addItem: () => void;
  items?: {
    name: string;
    color?: string;
    path: string;
    hasChildren?: boolean;
  }[];
  currentPath?: string;
}

const NavItemWithSubmenu = ({ 
  icon, 
  label, 
  active, 
  onToggle,
  addItem,
  items = [],
  currentPath = ''
}: NavItemWithSubmenuProps) => {
  return (
    <div>
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer",
          active ? "bg-projector-pink bg-opacity-20 text-gray-800" : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-3" onClick={onToggle}>
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addItem();
            }}
            className="mr-1 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200"
          >
            <PlusIcon size={14} />
          </button>
          <svg 
            className={cn("w-4 h-4 transition-transform", active ? "rotate-180" : "")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            onClick={onToggle}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {active && items.length > 0 && (
        <div className="pl-10 mt-1 space-y-1">
          {items.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-2 py-2 px-3 rounded-lg",
                currentPath === item.path ? "bg-gray-100" : "hover:bg-gray-100",
                item.hasChildren ? "justify-between" : ""
              )}
            >
              {item.color ? (
                <>
                  <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  <span>{item.name}</span>
                </>
              ) : (
                <span>{item.name}</span>
              )}
              
              {item.hasChildren && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
