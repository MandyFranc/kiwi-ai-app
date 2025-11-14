'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function PromptInput({ value, onChange, onKeyPress, disabled }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="Describe your dream... (e.g., a magical forest at sunset)"
          className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-transparent focus:border-cyan-400 focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
        />
        
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 -z-10"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: isFocused ? 0.5 : 0,
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ filter: 'blur(10px)' }}
        />
      </motion.div>

      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-right text-purple-200 text-sm"
        >
          {value.length} characters
        </motion.div>
      )}
    </div>
  );
}