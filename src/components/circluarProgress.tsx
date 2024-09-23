import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const CircularProgress = ({ value }: { value: number }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((value / 10) * 100); // Convert value (0-10) to percentage
  }, [value]);

  return (
    <div className="flex justify-center items-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="absolute">
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="gray"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          stroke="blue"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="339.292"
          strokeDashoffset="339.292"
          animate={{ strokeDashoffset: 339.292 - (progress / 100) * 339.292 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      
    </div>
  );
};

export default CircularProgress;
