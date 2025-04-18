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
      <motion.div
        className={`text-center p-6 rounded-xl glass dark:glass-dark ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gradient">
          The conference has started!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Join us now for this exciting event!
        </p>
      </motion.div>
    );
  }

  // Individual time unit component with subtle animation only when value changes
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <Card
        variant="glass"
        hover="raise"
        className="w-24 h-28 flex flex-col items-center justify-center shadow-md relative overflow-hidden transition-shadow duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 to-secondary-50/20 dark:from-primary-900/20 dark:to-secondary-900/20" />
        <motion.span
          className="text-4xl font-bold text-gradient"
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 1, scale: 1 }}
          key={`static-${label}`}
          transition={{ duration: 0.2 }}
        >
          {value.toString().padStart(2, "0")}
        </motion.span>
        <span className="text-xs uppercase tracking-wider mt-2 text-muted-foreground font-medium">
          {label}
        </span>
      </Card>
    </div>
  );

  return (
    <motion.div
      className={`py-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {title && (
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gradient">
          {title}
        </h3>
      )}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-2 max-w-2xl mx-auto">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </motion.div>
  );
};
