import React from 'react';
import { User, Shield, Key, Lock, Mail, AtSign, Bell, Star, Zap, Heart } from 'lucide-react';

// A component with login-themed SVG icons for the trail effect
export const LoginIcons: React.FC = () => {
  const iconComponents = [
    <User size={36} className="text-projector-darkblue" />,
    <Shield size={36} className="text-projector-darkblue" />,
    <Key size={36} className="text-projector-darkblue" />,
    <Lock size={36} className="text-projector-darkblue" />,
    <Mail size={36} className="text-projector-darkblue" />,
    <AtSign size={36} className="text-projector-darkblue" />,
    <Bell size={36} className="text-projector-darkblue" />,
    <Star size={36} className="text-projector-darkblue" />,
    <Zap size={36} className="text-projector-darkblue" />,
    <Heart size={36} className="text-projector-darkblue" />,
  ];
  
  return (
    <>
      {iconComponents.map((icon, index) => (
        <div 
          key={index} 
          className="p-2 bg-white/90 rounded-lg shadow-sm"
        >
          {icon}
        </div>
      ))}
    </>
  );
};

// Decorative shape components for login trail
export const LoginDecorations: React.FC = () => {
  return (
    <>
      {/* Circle */}
      <div className="w-12 h-12 rounded-full bg-projector-darkblue/80"></div>
      
      {/* Square */}
      <div className="w-12 h-12 rounded-md bg-blue-500/80"></div>
      
      {/* Triangle (using CSS) */}
      <div 
        className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px] border-l-transparent border-r-transparent border-b-indigo-500/80"
      ></div>
      
      {/* Diamond */}
      <div className="w-12 h-12 bg-purple-500/80 rotate-45"></div>
      
      {/* Hexagon (simplified with border radius) */}
      <div className="w-12 h-12 bg-teal-500/80 rounded-lg transform rotate-[30deg]"></div>
      
      {/* Letter P */}
      <div className="w-12 h-12 bg-projector-darkblue rounded-md flex items-center justify-center text-white text-xl font-bold">
        P
      </div>
      
      {/* Design element 1 */}
      <div className="w-14 h-6 bg-blue-500/80 rounded-full"></div>
      
      {/* Design element 2 */}
      <div className="w-10 h-10 border-4 border-indigo-500/80 rounded-full"></div>
      
      {/* Design element 3 */}
      <div className="w-12 h-3 bg-purple-500/80 rounded-full"></div>
      
      {/* Design element 4 */}
      <div className="w-4 h-12 bg-teal-500/80 rounded-full"></div>
    </>
  );
};

// Combining icons and decorations for more variety
export const LoginTrailElements: React.FC = () => {
  return (
    <>
      <LoginIcons />
      <LoginDecorations />
    </>
  );
}; 