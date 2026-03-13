import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  className?: string;
}

export default function Dock({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
  className
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{ height: panelHeight }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-3 px-4 pb-3 rounded-[2rem] bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl z-[100]",
        className
      )}
    >
      {items.map((item, i) => (
        <DockIcon
          key={i}
          mouseX={mouseX}
          baseItemSize={baseItemSize}
          magnification={magnification}
          {...item}
        />
      ))}
    </motion.div>
  );
}

function DockIcon({
  mouseX,
  baseItemSize,
  magnification,
  icon,
  label,
  onClick
}: DockItem & { mouseX: any; baseItemSize: number; magnification: number }) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [baseItemSize, magnification, baseItemSize]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative">
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width, height: width }}
        className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-primary hover:text-slate-900 transition-all duration-300 group relative"
      >
        <div className="flex items-center justify-center w-full h-full">
          {icon}
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap pointer-events-none shadow-xl"
          >
            {label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
