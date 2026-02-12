import React, { useState, useEffect } from 'react';

export const AnimatedNumber = ({ value, formatter = (v) => v }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatter(displayValue)}</span>;
};