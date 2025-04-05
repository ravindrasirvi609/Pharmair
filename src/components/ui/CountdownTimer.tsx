"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title = "Conference starts in:",
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Countdown has expired
  if (timeLeft.expired) {
    return (
      <div className={`text-center ${className}`}>
        <h2 className="text-xl font-bold text-primary-700 dark:text-primary-400">
          The conference has started!
        </h2>
      </div>
    );
  }

  // Individual time unit component with animation
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      className="flex flex-col items-center"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        variant="glass"
        className="w-full sm:w-20 h-20 sm:h-24 flex items-center justify-center mb-2"
      >
        <motion.span
          key={value} // This causes re-render and animation when value changes
          className="text-3xl sm:text-4xl font-bold"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {value.toString().padStart(2, "0")}
        </motion.span>
      </Card>
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </motion.div>
  );

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};
