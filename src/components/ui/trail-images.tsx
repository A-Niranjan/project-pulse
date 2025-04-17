import React from 'react';

// Various size options for trail images
const sizes = [
  { width: 40, height: 40 },
  { width: 50, height: 50 },
  { width: 60, height: 60 },
  { width: 35, height: 35 },
  { width: 45, height: 45 },
];

// Different styles for trail images
const styles = [
  { className: "rounded-full" },
  { className: "rounded-lg" },
  { className: "rounded-xl" },
  { className: "rounded-2xl" },
];

interface TrailImageProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  index?: number;
}

export const TrailImage = ({ src, alt = "Trail image", style, className = "", index = 0 }: TrailImageProps) => {
  // Use modulo to cycle through sizes and styles based on index
  const sizeIndex = index % sizes.length;
  const styleIndex = index % styles.length;
  
  // Combine the size with any custom styles
  const combinedStyle = {
    ...sizes[sizeIndex],
    ...style,
  };
  
  return (
    <img 
      src={src} 
      alt={alt} 
      style={combinedStyle}
      className={`object-cover ${styles[styleIndex].className} ${className}`}
    />
  );
};

// A set of predefined trail images
export const LoginTrailImages: React.FC = () => {
  const images = [
    "/images/trail-1.png", 
    "/images/trail-2.png",
    "/images/trail-3.png", 
    "/images/trail-4.png",
    "/images/trail-5.png",
  ];
  
  return (
    <>
      {images.map((src, index) => (
        <TrailImage key={index} src={src} index={index} />
      ))}
    </>
  );
};

// Geometric shapes for trail effects
export const GeometricShapes: React.FC = () => {
  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  
  return (
    <>
      {colors.map((color, index) => (
        <div 
          key={index}
          className={`${color} opacity-70 ${styles[index % styles.length].className}`}
          style={{
            width: sizes[index % sizes.length].width,
            height: sizes[index % sizes.length].height,
          }}
        />
      ))}
    </>
  );
};

// Branded shapes for trail effects
export const BrandedShapes: React.FC = () => {
  return (
    <>
      <div className="w-10 h-10 bg-projector-darkblue rounded-full flex items-center justify-center text-white font-bold">P</div>
      <div className="w-12 h-12 bg-projector-darkblue rounded-lg flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="w-9 h-9 border-2 border-projector-darkblue rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <div className="w-10 h-10 bg-projector-darkblue rounded-md flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      </div>
      <div className="w-11 h-11 border-2 border-projector-darkblue rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
    </>
  );
}; 