import { useEffect, useRef, useState } from 'react';

interface UseTimerProps {
  initialTime: number;
  isActive: boolean;
  onExpire?: () => void;
}

export const useTimer = ({ initialTime, isActive, onExpire }: UseTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            onExpire?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onExpire]);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const reset = () => {
    setTimeRemaining(initialTime);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resume = () => {
    if (timeRemaining > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            onExpire?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return {
    timeRemaining,
    reset,
    pause,
    resume,
  };
};
