
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptAnimationProps {
  onComplete: () => void;
}

const BLOCKS = [
  "Goal definition block",
  "Website structure block",
  "AI-tool instructions block",
  "Feature list block",
  "Deployment instructions block",
  "UI/UX style block"
];

const PromptAnimation: React.FC<PromptAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // 1. Initial wait
      await new Promise(r => setTimeout(r, 1000));
      setStep(1); // Open notepad
      
      await new Promise(r => setTimeout(r, 1500));
      setStep(2); // Explode blocks
      
      await new Promise(r => setTimeout(r, 4000));
      setStep(3); // Reassemble
      
      await new Promise(r => setTimeout(r, 2000));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#f0f2f5] flex items-center justify-center overflow-hidden">
      {/* Studio Lighting Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/5 pointer-events-none" />
      
      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        
        {/* The "Desk" surface shadow */}
        <div className="absolute bottom-0 w-full h-1/4 bg-black/5 blur-3xl opacity-30 transform -skew-x-12" />

        <AnimatePresence>
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0 }}
              className="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow-xl relative"
            >
              <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 rounded" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-300 font-light text-xs uppercase tracking-widest">
                Prompt Draft
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -110 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow-2xl origin-top relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-white border border-gray-200 rounded-lg" />
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-200 text-6xl">
                +
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <div className="relative w-full h-full flex items-center justify-center">
              {BLOCKS.map((block, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    z: 0, 
                    opacity: 0,
                    rotateY: 0
                  }}
                  animate={{ 
                    x: (i % 3 - 1) * 350, 
                    y: Math.floor(i / 3 - 0.5) * 250, 
                    z: 100,
                    opacity: 1,
                    rotateY: i % 2 === 0 ? 15 : -15
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 50, 
                    damping: 20,
                    delay: i * 0.1 
                  }}
                  className="absolute w-72 p-6 bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl shadow-lg flex flex-col gap-2"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-gray-800 font-semibold">{block}</h3>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-3/4 bg-gray-100 rounded" />
                  </div>
                  {/* Exploded lines simulation */}
                  <div className="absolute -z-10 w-full h-full border border-blue-100 scale-110 rounded-xl opacity-20" />
                </motion.div>
              ))}
            </div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-2xl p-12 bg-white rounded-sm shadow-2xl border border-gray-200 font-serif leading-relaxed text-gray-800 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
              <h1 className="text-2xl font-bold mb-6 text-center border-b pb-4">UNWATERMARK PROMPT SPECIFICATION</h1>
              <p className="text-sm italic text-gray-500 mb-8">Generated Assembly • Workspace V1.0</p>
              <div className="space-y-4">
                <p>"Create a fully functional web application that includes an AI-powered watermark-removal tool similar to unwatermark.ai. The site must support uploading images and videos, process them through an AI model to remove watermarks, display results, and allow downloads. Include a modern, responsive UI, dashboard, credits system, API endpoint for watermark removal, and support for formats MP4, MOV, AVI, MKV, WEBM..."</p>
                <div className="h-4 bg-gray-50 rounded" />
                <div className="h-4 bg-gray-50 rounded" />
              </div>
              <div className="mt-12 flex justify-end">
                <div className="w-24 h-1 bg-gray-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PromptAnimation;
