'use client';

import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';

export function GenerateButton({ onClick, disabled, isGenerating }) {
  return (
    <div className="mt-6 flex justify-center">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className="relative px-8 py-4 rounded-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />

        <div className="relative flex items-center gap-3 text-white font-medium">
          <motion.div
            animate={isGenerating ? {
              rotate: 360,
            } : {}}
            transition={{
              duration: 1,
              repeat: isGenerating ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Wand2 className="w-5 h-5" />
          </motion.div>
          <span className="tracking-wide">
            {isGenerating ? 'Generating...' : 'Generate Dream'}
          </span>
          <Sparkles className="w-5 h-5" />
        </div>

        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}