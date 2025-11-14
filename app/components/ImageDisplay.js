'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import Image from 'next/image';

export function ImageDisplay({ image, prompt }) {
  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image;
    link.download = `flux-generation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative">
          <motion.div
            className="relative rounded-2xl overflow-hidden group"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            <Image
              src={image}
              alt={prompt || 'Generated image'}
              width={1024}
              height={1024}
              className="w-full h-auto rounded-2xl"
            />

            <motion.div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                title="Download image"
                onClick={handleDownload}
              >
                <Download className="w-6 h-6 text-white" />
              </motion.button>
            </motion.div>
          </motion.div>

          {prompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-purple-200 text-sm">
                <span className="text-cyan-300 font-medium">Prompt:</span> {prompt}
              </p>
            </motion.div>
          )}

          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-400/50 rounded-br-3xl pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}