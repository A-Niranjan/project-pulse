import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import ImageTrail from "@/components/ui/image-trail";
import { LoginTrailElements } from "@/components/ui/login-images";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would connect to an authentication service
      console.log("Authentication data:", data);
      
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify({
        name: isSignUp ? data.name : "Niranjan",
        email: data.email,
        avatarUrl: "/uploads/6653e968-d824-406d-a044-035175d60980.png"
      }));
      
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp ? "Your account has been created successfully." : "You have successfully logged in.",
      });
      
      // Force navigation and reload to ensure authentication state is updated
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Could not authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-projector-ivory overflow-hidden relative" ref={containerRef}>
      {/* Image Trail Effect */}
      <ImageTrail
        containerRef={containerRef}
        interval={150}
        rotationRange={30}
        animationSequence={[
          [{ scale: 1.2, opacity: 0.8 }, { duration: 0.2, ease: "circOut" }],
          [{ scale: 0, opacity: 0 }, { duration: 0.7, ease: "circIn" }],
        ]}
      >
        <LoginTrailElements />
      </ImageTrail>
      
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-black/5 z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-projector-darkblue">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isSignUp 
              ? "Sign up to unlock your productivity potential" 
              : "Sign in to continue your journey"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-all hover:bg-gray-200">
                <User className="text-gray-500 mr-3" size={20} />
                <Input 
                  id="name"
                  placeholder="Full Name" 
                  {...register("name", { required: isSignUp })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">Name is required</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-all hover:bg-gray-200">
              <Mail className="text-gray-500 mr-3" size={20} />
              <Input 
                id="email"
                type="email" 
                placeholder="Email Address" 
                {...register("email", { 
                  required: true, 
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                })}
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />
            </div>
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
            {errors.email?.type === "pattern" && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-all hover:bg-gray-200">
              <Lock className="text-gray-500 mr-3" size={20} />
              <Input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                {...register("password", { 
                  required: true,
                  minLength: isSignUp ? 8 : undefined
                })}
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
            )}
          </div>
          
          {isSignUp && (
            <div className="space-y-2">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-all hover:bg-gray-200">
                <Lock className="text-gray-500 mr-3" size={20} />
                <Input 
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  {...register("confirmPassword", { 
                    required: isSignUp,
                    validate: (value, formValues) => value === formValues.password
                  })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                />
              </div>
              {errors.confirmPassword?.type === "required" && (
                <p className="text-red-500 text-xs mt-1">Please confirm your password</p>
              )}
              {errors.confirmPassword?.type === "validate" && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-projector-darkblue hover:bg-opacity-90 text-white rounded-lg py-3 mt-4 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </div>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-projector-darkblue hover:underline font-medium ml-1"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
