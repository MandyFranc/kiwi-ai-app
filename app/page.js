'use client';

import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { FloatingParticles } from './components/FloatingParticles';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { ImageDisplay } from './components/ImageDisplay';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    
    setStatus('generating');
    setError(null);
    
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      setStatus('failed');
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        setStatus('failed');
        return;
      }
      setPrediction(prediction);
    }
    
    if (prediction.status === "succeeded") {
      setStatus('succeeded');
    } else {
      setStatus('failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && prompt.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h1 className="text-5xl font-bold text-white">
              Dream something with{' '}
              
                href="https://replicate.com/black-forest-labs/flux-schnell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all underline decoration-cyan-400/50"
              >
                Flux Schnell
              </a>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-purple-200 text-lg max-w-2xl mx-auto"
          >
            Turn your imagination into reality with AI-powered image generation
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onKeyPress={handleKeyPress}
              disabled={status === 'generating'}
            />
            
            <GenerateButton
              onClick={handleSubmit}
              disabled={!prompt.trim() || status === 'generating'}
              isGenerating={status === 'generating'}
            />

            <AnimatePresence mode="wait">
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center justify-center gap-2"
                >
                  {status === 'generating' && (
                    <>
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      <span className="text-cyan-300">Generating your dream...</span>
                    </>
                  )}
                  {status === 'succeeded' && (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-300">Generation complete!</span>
                    </>
                  )}
                  {status === 'failed' && (
                    <span className="text-red-300">{error || 'Generation failed. Please try again.'}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <ImageDisplay 
          image={prediction?.output?.[prediction.output.length - 1]} 
          prompt={prompt} 
        />
      </div>
    </div>
  );
}