import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../App';

interface SlotMachineScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function SlotMachineScreen({ participants, onDrawComplete }: SlotMachineScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState<string[]>(['', '', '']);
  const [finalWinner, setFinalWinner] = useState<string>('');

  useEffect(() => {
    if (participants.length > 0 && !isSpinning) {
      setSlots([
        participants[0]?.name || '',
        participants[1]?.name || '',
        participants[2]?.name || '',
      ]);
    }
  }, [participants, isSpinning]);

  const startSpin = () => {
    if (participants.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    const spinDuration = 5000;
    const slowDownStart = 3000;
    
    // Rapid spinning phase
    const spinInterval = setInterval(() => {
      setSlots([
        participants[Math.floor(Math.random() * participants.length)].name,
        participants[Math.floor(Math.random() * participants.length)].name,
        participants[Math.floor(Math.random() * participants.length)].name,
      ]);
    }, 50);

    // Slow down phase
    setTimeout(() => {
      clearInterval(spinInterval);
      const slowInterval = setInterval(() => {
        setSlots([
          participants[Math.floor(Math.random() * participants.length)].name,
          participants[Math.floor(Math.random() * participants.length)].name,
          participants[Math.floor(Math.random() * participants.length)].name,
        ]);
      }, 150);

      setTimeout(() => {
        clearInterval(slowInterval);
        const winner = participants[Math.floor(Math.random() * participants.length)].name;
        setSlots([winner, winner, winner]);
        setFinalWinner(winner);
        setIsSpinning(false);
        setTimeout(() => {
          onDrawComplete(winner);
        }, 1500);
      }, spinDuration - slowDownStart);
    }, slowDownStart);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono"
      >
        LUCKY DRAW
      </motion.h2>

      {/* Slot Machine Container */}
      <div className="relative">
        {/* Glass panel background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-xl rounded-3xl border border-cyan-500/30" />
        
        {/* Glow effect when spinning */}
        {isSpinning && (
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"
          />
        )}

        {/* Slots */}
        <div className="relative p-12 flex gap-8 justify-center items-center">
          {slots.map((name, index) => (
            <div key={index} className="relative">
              {/* Slot frame */}
              <div className="relative w-64 h-80 bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-cyan-400/50 overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                {/* Name display */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={name + index}
                      initial={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
                      transition={{ duration: 0.1 }}
                      className="text-center"
                    >
                      <p className={`font-mono ${isSpinning ? 'text-cyan-300' : 'text-cyan-400 text-3xl'} break-words`}>
                        {name}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Light streak effect when spinning */}
                {isSpinning && (
                  <motion.div
                    animate={{ y: [-100, 400] }}
                    transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                  />
                )}
              </div>

              {/* Side glow */}
              {isSpinning && (
                <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl" />
              )}
            </div>
          ))}
        </div>

        {/* Energy wave effect on stop */}
        {finalWinner && !isSpinning && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 border-4 border-cyan-400 rounded-3xl"
          />
        )}
      </div>

      {/* Draw button */}
      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSpin}
          disabled={isSpinning || participants.length === 0}
          className="relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-mono text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isSpinning && (
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
          <span className="relative z-10">
            {isSpinning ? 'SPINNING...' : 'START DRAW'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
