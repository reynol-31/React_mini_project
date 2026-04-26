import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * HeroSection Component
 * Design: Minimalist Scientific Precision
 * - Full-screen hero with parallax background
 * - Large bold title with subtle fade-in animation
 * - Teal accent for CTA button
 */

const HeroSection = () => {
  const targetRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  // Zoom the globe continuously over the pinned duration
  const globeScale = useTransform(scrollYProgress, [0, 0.66], [1, 15]);
  
  // Crossfade the entire HeroSection directly into Scene 1 while it is fully pinned
  const sectionOpacity = useTransform(scrollYProgress, [0.4, 0.66], [1, 0]);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={targetRef}
      className="relative h-[300vh] z-20 -mb-[200vh]"
    >
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pt-16 bg-background"
        style={{ opacity: sectionOpacity }}
      >
        {/* Spline 3D Background - Positioned at the bottom, showing only the upper half */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden origin-bottom"
          style={{ scale: globeScale }}
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
        >
          <div className="absolute top-[100%] left-1/2 w-[100vw] h-[100vh] -translate-x-1/2 -translate-y-1/2 scale-[1] origin-center">
            {/* @ts-ignore */}
            <spline-viewer url="https://prod.spline.design/mV83ATYGalfUFdZD/scene.splinecode"></spline-viewer>
          </div>
        </motion.div>

        {/* Content (Moved to higher z-index so text overlays everything) */}
        <motion.div 
          className="container relative z-40 mx-auto px-4 text-center pointer-events-none mb-24"
          style={{ opacity: textOpacity, y: textY }}
        >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="section-label mb-4 inline-block">
            Engineering Major Project
          </span>
        </motion.div>

        <motion.h1
          className="display-title mb-6 text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Automated Detection and Vessel Attribution of Illegal Bilge Dumping
        </motion.h1>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: indicatorOpacity }}
        >
          <ChevronDown className="text-accent" size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
