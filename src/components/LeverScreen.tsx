import { useState } from 'react';
import { motion } from 'motion/react';
import { Participant } from '../App';

interface LeverScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function LeverScreen({ participants, onDrawComplete }: LeverScreenProps) {
  const [isPulled, setIsPulled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLeverPull = () => {
    if (participants.length === 0 || isPulled || isProcessing) return;
    
    setIsPulled(true);
    setIsProcessing(true);

    // Energy build-up phase
    setTimeout(() => {
      const winner = participants[Math.floor(Math.random() * participants.length)].name;
      onDrawComplete(winner);
      
      setTimeout(() => {
        setIsPulled(false);
        setIsProcessing(false);
      }, 2000);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono"
      >
        PULL TO DRAW
      </motion.h2>

      <div className="relative flex flex-col items-center">
        {/* Spotlight effect */}
        <div className="absolute top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Machine frame */}
        <div className="relative z-10 w-full max-w-md p-12 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/30">
          {/* Energy core */}
          <div className="mb-12 flex justify-center">
            <motion.div
              animate={isProcessing ? {
                boxShadow: [
                  '0 0 20px rgba(6,182,212,0.5)',
                  '0 0 60px rgba(6,182,212,0.8)',
                  '0 0 20px rgba(6,182,212,0.5)',
                ],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center relative overflow-hidden"
            >
              {/* Core glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 animate-pulse" />
              
              {/* Energy ripples */}
              {isProcessing && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                      className="absolute inset-0 border-2 border-cyan-400 rounded-full"
                    />
                  ))}
                </>
              )}

              {/* Center dot */}
              <div className="relative z-10 w-8 h-8 rounded-full bg-white" />
            </motion.div>
          </div>

          {/* Lever */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleLeverPull}
              disabled={isPulled || isProcessing || participants.length === 0}
              animate={isPulled ? { y: 100 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              className="relative cursor-pointer disabled:cursor-not-allowed"
            >
              {/* Lever handle */}
              <div className="relative">
                {/* Glow effect */}
                {isProcessing && (
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(6,182,212,0.5)',
                        '0 0 40px rgba(6,182,212,0.8)',
                        '0 0 20px rgba(6,182,212,0.5)',
                      ],
                    }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                )}

                {/* Handle sphere */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 border-4 border-slate-800 shadow-2xl">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-yellow-400 opacity-80" />
                  <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/40 blur-sm" />
                </div>

                {/* Lever arm */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-32 bg-gradient-to-b from-slate-600 to-slate-800 border-x-2 border-slate-700" />
              </div>

              {/* Energy flow when pulled */}
              {isProcessing && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 200 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"
                />
              )}
            </motion.button>
          </div>

          {/* Instructions */}
          <div className="mt-16 text-center">
            <p className="text-cyan-300/60 font-mono">
              {isProcessing ? 'PROCESSING...' : 'Click lever to draw'}
            </p>
          </div>
        </div>

        {/* Screen shake effect */}
        {isProcessing && (
          <motion.div
            animate={{
              x: [0, -2, 2, -2, 2, 0],
              y: [0, -1, 1, -1, 1, 0],
            }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="fixed inset-0 pointer-events-none"
          />
        )}

        {/* Light burst effects */}
        {isProcessing && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="absolute w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
