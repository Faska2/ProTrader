import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1000,
  decimals = 0,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        startValueRef.current = displayValue;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (value - startValueRef.current) * easeOutCubic;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [value, duration, displayValue]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.round(num).toLocaleString();
  };

  return (
    <span className={className}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  className,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(20px)';
        case 'down': return 'translateY(-20px)';
        case 'left': return 'translateX(20px)';
        case 'right': return 'translateX(-20px)';
        default: return 'none';
      }
    }
    return 'none';
  };

  return (
    <div
      ref={ref}
      className={clsx(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <div
      className={clsx('animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out', className)}
    >
      {children}
    </div>
  );
};

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className, staggerDelay = 100 }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          style={{
            animation: `fadeInUp 500ms ease-out ${index * staggerDelay}ms both`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
