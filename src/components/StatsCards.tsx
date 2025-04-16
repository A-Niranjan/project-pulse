
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Info, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const StatsCards = () => {
  const [weeklyActivity, setWeeklyActivity] = useState(58);
  const [weeklyChange, setWeeklyChange] = useState(3);
  const [totalProgress, setTotalProgress] = useState(55);
  const [totalProgressChange, setTotalProgressChange] = useState(7);
  const [currentWeek, setCurrentWeek] = useState("July 24 - 28");
  const [activeDate, setActiveDate] = useState("26");
  const [totalTime, setTotalTime] = useState("24");
  const [currentTime, setCurrentTime] = useState("00:00:00");
  
  // Generate realistic activity data for chart visualization
  const [activityData, setActivityData] = useState<number[]>(
    Array(24).fill(0).map(() => Math.floor(Math.random() * 40) + 20)
  );
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Simulate real-time data updates
  useEffect(() => {
    const dataUpdate = setInterval(() => {
      // Random fluctuations for weekly activity
      setWeeklyActivity(prev => {
        const newValue = prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2;
        return Math.min(Math.max(Math.round(newValue * 10) / 10, 30), 80); // Keep between 30-80%
      });
      
      // Random fluctuations for weekly change
      setWeeklyChange(prev => {
        const newValue = prev + (Math.random() > 0.5 ? 0.5 : -0.5);
        return Math.min(Math.max(Math.round(newValue * 10) / 10, -5), 10); // Keep between -5% and 10%
      });
      
      // Random fluctuations for total progress
      setTotalProgress(prev => {
        const newValue = prev + (Math.random() > 0.5 ? 1 : -0.5) * Math.random() * 1.5;
        return Math.min(Math.max(Math.round(newValue * 10) / 10, 30), 80); // Keep between 30-80%
      });
      
      // Random fluctuations for total progress change
      setTotalProgressChange(prev => {
        const newValue = prev + (Math.random() > 0.6 ? 0.5 : -0.5);
        return Math.min(Math.max(Math.round(newValue * 10) / 10, -5), 10); // Keep between -5% and 10%
      });
      
      // Update total time randomly
      setTotalTime(prev => {
        const hours = parseInt(prev);
        const newHours = Math.random() > 0.8 ? hours + 0.1 : hours;
        return newHours.toFixed(1);
      });
      
      // Update activity data for chart
      setActivityData(prev => {
        const newData = [...prev];
        newData.shift(); // Remove the first data point
        newData.push(Math.floor(Math.random() * 40) + 20); // Add a new data point
        return newData;
      });
    }, 3000); // Update every 3 seconds for more visible changes
    
    return () => clearInterval(dataUpdate);
  }, []);
  
  const handlePreviousWeek = () => {
    setCurrentWeek("July 17 - 21");
    // Simulate different data for previous week
    setWeeklyActivity(Math.floor(Math.random() * 30) + 40);
    setWeeklyChange(Math.floor(Math.random() * 10) - 2);
    setTotalProgress(Math.floor(Math.random() * 30) + 30);
    
    toast({
      title: "Weekly View",
      description: "Changed to previous week: July 17 - 21",
    });
  };
  
  const handleNextWeek = () => {
    setCurrentWeek("July 31 - Aug 4");
    // Simulate different data for next week (projected)
    setWeeklyActivity(Math.floor(Math.random() * 20) + 60);
    setWeeklyChange(Math.floor(Math.random() * 8) + 2);
    setTotalProgress(Math.floor(Math.random() * 20) + 60);
    
    toast({
      title: "Weekly View",
      description: "Changed to next week: July 31 - Aug 4",
    });
  };
  
  const selectDate = (date: string) => {
    setActiveDate(date);
    // Simulate different data for each date
    setTotalTime((parseInt(date) % 10 + 15).toString());
    
    toast({
      title: "Selected Date",
      description: `Viewing data for July ${date}`,
    });
  };
  
  const viewDetails = () => {
    toast({
      title: "Working Activity",
      description: "Opening detailed time tracking view",
    });
  };
  
  return (
    <div className="space-y-4">
      <WeeklyActivityCard 
        percentage={weeklyActivity} 
        change={weeklyChange} 
        activityData={activityData}
      />
      <TotalProgressCard percentage={totalProgress} change={totalProgressChange} />
      <WorkingActivityCard 
        currentWeek={currentWeek} 
        activeDate={activeDate} 
        totalTime={totalTime}
        currentTime={currentTime}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onSelectDate={selectDate}
        onViewDetails={viewDetails}
      />
    </div>
  );
};

interface WeeklyActivityCardProps {
  percentage: number;
  change: number;
  activityData: number[];
}

const WeeklyActivityCard = ({ percentage, change, activityData }: WeeklyActivityCardProps) => {
  // Calculate path for chart visualization
  const chartHeight = 50;
  const chartWidth = 200;
  const points = activityData.map((value, index) => {
    const x = (index / (activityData.length - 1)) * chartWidth;
    const y = chartHeight - ((value / 100) * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="stats-card stats-card-lime bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-emerald-700" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 12L5.5 9.5M5.5 9.5L8 7M5.5 9.5L8 12M5.5 9.5L3 7M9 17L12.5 14M12.5 14L16 11M12.5 14L16 17M12.5 14L9 11M17 7L19.5 9.5M19.5 9.5L22 12M19.5 9.5L22 7M19.5 9.5L17 12" 
              stroke="currentColor" 
              strokeWidth="2"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-lg">Weekly activity</h3>
            <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
          </div>
        </div>
        <div 
          className={`px-2 py-1 bg-white bg-opacity-40 rounded-full text-sm font-medium flex items-center ${
            change >= 0 ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {change >= 0 ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`}
        </div>
      </div>
      
      <div className="mt-4">
        <svg className="w-full h-12" viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none">
          <polyline 
            points={points}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-green-700"
          />
          <circle 
            cx={chartWidth} 
            cy={chartHeight - ((activityData[activityData.length - 1] / 100) * chartHeight)} 
            r="3" 
            fill="currentColor" 
            className="text-green-700"
          />
        </svg>
      </div>
    </div>
  );
};

interface TotalProgressCardProps {
  percentage: number;
  change: number;
}

const TotalProgressCard = ({ percentage, change }: TotalProgressCardProps) => {
  // Calculate stroke dashoffset based on percentage
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - percentage / 100);
  
  return (
    <div className="stats-card stats-card-pink bg-gradient-to-br from-purple-100 to-pink-200 rounded-3xl p-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-lg">Total progress</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <Info size={14} />
            </button>
          </div>
          <p className="text-sm">this week</p>
        </div>
        <div 
          className={`px-2 py-1 bg-white bg-opacity-40 rounded-full text-sm font-medium flex items-center ${
            change >= 0 ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {change >= 0 ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`}
        </div>
      </div>
      
      <div className="flex justify-center items-center mt-4">
        <div className="relative">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#D8A8E0" 
              strokeWidth="10"
              className="opacity-30"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#9F21AB"
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              transform="rotate(-90 50 50)"
              className="transition-all duration-700 ease-in-out"
            />
            <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">
              {percentage.toFixed(1)}%
            </text>
            <text x="50" y="60" textAnchor="middle" fontSize="8" fill="currentColor">
              COMPLETION
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

interface WorkingActivityCardProps {
  currentWeek: string;
  activeDate: string;
  totalTime: string;
  currentTime: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: string) => void;
  onViewDetails: () => void;
}

const WorkingActivityCard = ({ 
  currentWeek, 
  activeDate, 
  totalTime,
  currentTime,
  onPreviousWeek, 
  onNextWeek, 
  onSelectDate,
  onViewDetails 
}: WorkingActivityCardProps) => {
  // Generate random time blocks for visualization
  const [timeBlocks, setTimeBlocks] = useState(() => 
    Array(7).fill(0).map((_, i) => ({
      left: `${(i + 1) * 10 + Math.random() * 5}%`,
      top: `${Math.random() * 25}%`,
      height: `${Math.random() * 20 + 10}%`,
      color: i % 3 === 0 ? "bg-projector-orange" : 
             i % 3 === 1 ? "bg-projector-lime" : "bg-projector-pink"
    }))
  );
  
  // Update time blocks when active date changes
  useEffect(() => {
    const newBlocks = Array(7).fill(0).map((_, i) => ({
      left: `${(i + 1) * 10 + Math.random() * 5}%`,
      top: `${Math.random() * 25}%`,
      height: `${Math.random() * 20 + 10}%`,
      color: i % 3 === 0 ? "bg-projector-orange" : 
             i % 3 === 1 ? "bg-projector-lime" : "bg-projector-pink"
    }));
    setTimeBlocks(newBlocks);
  }, [activeDate]);
  
  return (
    <div className="bg-white rounded-3xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Working activity</h3>
        <div className="flex items-center bg-gray-100 rounded-full">
          <button className="p-1 hover:bg-gray-200 rounded-l-full" onClick={onPreviousWeek}>
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 text-sm">{currentWeek}</span>
          <button className="p-1 hover:bg-gray-200 rounded-r-full" onClick={onNextWeek}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 overflow-x-auto py-1 no-scrollbar">
        <WeekdayButton day="Wed" date="24" active={activeDate === "24"} onClick={() => onSelectDate("24")} />
        <WeekdayButton day="Thu" date="25" active={activeDate === "25"} onClick={() => onSelectDate("25")} />
        <WeekdayButton day="Fri" date="26" active={activeDate === "26"} onClick={() => onSelectDate("26")} />
        <WeekdayButton day="Sat" date="27" active={activeDate === "27"} onClick={() => onSelectDate("27")} />
        <WeekdayButton day="Sun" date="28" active={activeDate === "28"} onClick={() => onSelectDate("28")} />
      </div>

      <div className="relative h-48 bg-gray-50 rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-3 left-3 right-3 top-3">
            {/* Colorful time blocks */}
            {timeBlocks.map((block, index) => (
              <div 
                key={index}
                className={`absolute w-3 rounded-full ${block.color}`}
                style={{ 
                  left: block.left,
                  top: block.top,
                  height: block.height
                }}
              />
            ))}
            
            {/* Current time indicator */}
            <div className="absolute right-16 bottom-16 bg-projector-darkblue text-white py-2 px-3 rounded-lg shadow-lg animate-pulse">
              <div className="text-sm font-medium">{currentTime}</div>
              <div className="text-xs">Banking app shot</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total time:</p>
          <p className="text-xl font-semibold">{totalTime} hours</p>
        </div>
        <button 
          onClick={onViewDetails}
          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View details
        </button>
      </div>
    </div>
  );
};

interface WeekdayButtonProps {
  day: string;
  date: string;
  active?: boolean;
  onClick: () => void;
}

const WeekdayButton = ({ day, date, active, onClick }: WeekdayButtonProps) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-sm transition-all duration-200 ${
      active 
        ? 'bg-projector-pink text-projector-darkblue font-medium shadow-sm scale-110' 
        : 'hover:bg-gray-100'
    }`}
  >
    <span className="text-xs">{day}</span>
    <span className="font-semibold">{date}</span>
  </button>
);
