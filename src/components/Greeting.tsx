
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface GreetingProps {
  username: string;
}

export const Greeting = ({ username }: GreetingProps) => {
  const [greeting, setGreeting] = useState("");
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold">{greeting}, {username}!</h1>
      <p className="text-gray-500">{formattedDate}</p>
    </div>
  );
};
