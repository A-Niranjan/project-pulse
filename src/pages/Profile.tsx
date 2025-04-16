import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useForm } from "react-hook-form";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    
    setValue("name", parsedUser.name);
    setValue("email", parsedUser.email);
    setValue("role", "Senior Designer");
    setValue("bio", "Design enthusiast with 5+ years of experience in UX/UI design and project management. Passionate about creating intuitive and engaging user experiences.");
  }, [navigate, setValue]);
  
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...userData, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-projector-ivory">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username={userData.name} 
          avatarUrl={userData.avatarUrl} 
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold">Your Profile</h1>
              <p className="text-gray-500">Manage your account settings and preferences</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="mb-6 flex items-center">
                <div className="mr-6">
                  <img
                    src={userData.avatarUrl}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-projector-ivory"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-gray-500">Senior Designer</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="name">
                      Full Name
                    </label>
                    <Input 
                      id="name"
                      placeholder="Enter your name" 
                      {...register("name", { required: true })}
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">Name is required</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">
                      Email Address
                    </label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Enter your email" 
                      {...register("email", { 
                        required: true, 
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                      })}
                      className="w-full"
                    />
                    {errors.email?.type === "required" && (
                      <p className="text-red-500 text-xs mt-1">Email is required</p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="role">
                      Role
                    </label>
                    <Input 
                      id="role"
                      placeholder="Enter your role" 
                      {...register("role")}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="team">
                      Team
                    </label>
                    <Input 
                      id="team"
                      placeholder="Enter your team" 
                      {...register("team")}
                      defaultValue="Design Team"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="bio">
                    Bio
                  </label>
                  <Textarea 
                    id="bio"
                    placeholder="Tell us about yourself" 
                    {...register("bio")}
                    className="w-full"
                    rows={4}
                  />
                </div>
                
                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="border-projector-darkblue text-projector-darkblue hover:bg-projector-darkblue hover:text-white"
                  >
                    Log Out
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-projector-darkblue hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        Updating Profile...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
