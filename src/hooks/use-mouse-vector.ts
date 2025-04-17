import { useEffect, useRef, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface MouseVector extends MousePosition {
  vx: number;
  vy: number;
  speed: number;
}

export function useMouseVector(containerRef?: React.RefObject<HTMLElement>) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [vector, setVector] = useState<MouseVector>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  const prevPosition = useRef<MousePosition>({ x: 0, y: 0 });
  const prevTimestamp = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef?.current || document.documentElement;
      const rect = container.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const timestamp = Date.now();
      
      // Update position
      setPosition({ x, y });
      
      // Calculate velocity if we have previous position
      if (prevTimestamp.current) {
        const dt = Math.max(1, timestamp - prevTimestamp.current); // Time difference in ms
        const dx = x - prevPosition.current.x;
        const dy = y - prevPosition.current.y;
        
        const vx = dx / dt * 1000; // Convert to speed per second
        const vy = dy / dt * 1000;
        const speed = Math.sqrt(vx * vx + vy * vy);
        
        setVector({ x, y, vx, vy, speed });
      }
      
      // Store current values for next calculation
      prevPosition.current = { x, y };
      prevTimestamp.current = timestamp;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        const touchEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as MouseEvent;
        handleMouseMove(touchEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return { position, vector };
} 