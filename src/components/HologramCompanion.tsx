"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Point {
  x: number;
  y: number;
  alpha: number;
}

export const HologramCompanion = ({ isActive }: { isActive: boolean }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [flipped, setFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);
  const controls = useAnimation();

  // Handle movement and flipping
  useEffect(() => {
    const moveAgent = async () => {
      const targetX = Math.random() * (window.innerWidth - 100);
      const targetY = Math.random() * (window.innerHeight - 100);
      
      // Determine flip based on direction
      if (targetX < position.x) setFlipped(true);
      else setFlipped(false);

      await controls.start({
        x: targetX,
        y: targetY,
        transition: { 
          duration: 3 + Math.random() * 2, 
          ease: "easeInOut" 
        }
      });
      
      setPosition({ x: targetX, y: targetY });
    };

    const interval = setInterval(() => {
      moveAgent();
    }, 4000);

    return () => clearInterval(interval);
  }, [controls, position.x]);

  // Handle the "Wave of Blue" trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update points
      points.current = points.current.filter(p => p.alpha > 0.01);
      points.current.forEach(p => {
        p.alpha *= 0.96; // Fade out
      });

      // Draw trail
      if (points.current.length > 2) {
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        
        for (let i = 1; i < points.current.length; i++) {
          const p = points.current[i];
          ctx.strokeStyle = `rgba(0, 212, 255, ${p.alpha})`;
          ctx.lineWidth = 4 * p.alpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00d4ff";
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }
      }
      
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Capture position for trail
  useEffect(() => {
    const updateTrail = () => {
      // We get the visual position from the DOM element since framer-motion handles it
      const el = document.getElementById("hologram-agent");
      if (el) {
        const rect = el.getBoundingClientRect();
        points.current.push({ 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2, 
          alpha: 1 
        });
      }
    };

    const interval = setInterval(updateTrail, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-40"
      />
      <motion.div
        id="hologram-agent"
        animate={controls}
        initial={{ x: 100, y: 100 }}
        className="fixed z-50 pointer-events-none"
        style={{ width: 60, height: 60 }}
      >
        <motion.div
          animate={{ 
            rotateY: flipped ? 180 : 0,
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-full h-full"
        >
          {/* Using the generated image or a fallback svg if image not loaded */}
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
          <div className="relative w-full h-full flex items-center justify-center">
             <Image 
               src="/tiny_blue_hologram_agent.png" 
               alt="Hologram Agent" 
               width={60} 
               height={60} 
               className="drop-shadow-[0_0_15px_rgba(0,212,255,0.8)] opacity-90 mix-blend-screen"
             />
          </div>
          
          {/* Glitch effects */}
          <motion.div 
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
            className="absolute inset-0 bg-primary/30 mix-blend-screen translate-x-1"
          />
        </motion.div>
      </motion.div>
    </>
  );
};
