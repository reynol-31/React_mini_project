import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal Component
 * Design: Minimalist Scientific Precision
 * - Fade in and slide up animation on scroll
 * - Triggered when element enters viewport
 * - Professional timing (0.6s ease-out)
 */

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ScrollReveal = ({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getInitialPosition = () => {
    switch (direction) {
      case 'down':
        return { y: -30 };
      case 'left':
        return { x: -30 };
      case 'right':
        return { x: 30 };
      case 'up':
      default:
        return { y: 30 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
