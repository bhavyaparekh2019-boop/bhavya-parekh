import React from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  className?: string;
  highlight?: string;
}

export default function BlurText({
  text,
  delay = 200,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
  highlight = '',
  centered = true,
}: BlurTextProps & { centered?: boolean }) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const highlightWords = highlight.toLowerCase().split(' ');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      y: direction === 'top' ? -20 : 20 
    },
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    },
  };

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onAnimationComplete}
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: centered ? 'center' : 'flex-start' 
      }}
    >
      {elements.map((el, i) => {
        const cleanWord = el.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
        const isHighlighted = highlightWords.includes(cleanWord);
        return (
          <motion.span
            key={i}
            variants={itemVariants}
            className={isHighlighted ? 'text-primary' : ''}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {el}{animateBy === 'words' && i !== elements.length - 1 ? '\u00A0' : ''}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
