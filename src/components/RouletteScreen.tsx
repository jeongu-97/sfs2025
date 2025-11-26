import { useState } from 'react';
import { motion } from 'motion/react';
import { Participant } from '../App';

interface RouletteScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function RouletteScreen({ participants, onDrawComplete }: RouletteScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const startSpin = () => {
    if (participants.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    
    // Calculate winner
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const baseRotations = 5; // 5 full spins
    const segmentAngle = 360 / participants.length;
    const targetRotation = baseRotations * 360 + (360 - winnerIndex * segmentAngle) + segmentAngle / 2;
    
    setRotation(targetRotation);
    setSelectedIndex(winnerIndex);
    
    // Complete after animation
    setTimeout(() => {
      setIsSpinning(false);
      onDrawComplete(participants[winnerIndex].name);
    }, 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono"
      >
        SPIN THE WHEEL
      </motion.h2>

      <div className="relative flex flex-col items-center">
        {/* Pointer/Lock indicator */}
        <motion.div
          animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="relative z-20 mb-4"
        >
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </motion.div>

        {/* Roulette wheel */}
        <div className="relative w-[600px] h-[600px]">
          {/* Outer glow ring */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(6,182,212,0.3)',
                '0 0 60px rgba(6,182,212,0.6)',
                '0 0 30px rgba(6,182,212,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-cyan-400/50"
          />

          {/* Rotating wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.17, 0.67, 0.12, 0.99] }}
            className="absolute inset-8 rounded-full overflow-hidden"
            style={{ transformOrigin: 'center' }}
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl" />

            {/* Segments */}
            {participants.map((participant, index) => {
              const segmentAngle = 360 / participants.length;
              const startAngle = index * segmentAngle;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={participant.id}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    transformOrigin: 'center',
                  }}
                >
                  {/* Segment slice */}
                  <div
                    className={`absolute left-1/2 top-1/2 origin-top-left h-[300px] ${
                      isEven ? 'bg-cyan-500/20' : 'bg-blue-500/20'
                    } border-r border-cyan-400/30`}
                    style={{
                      width: `${Math.tan((segmentAngle * Math.PI) / 360) * 300}px`,
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    }}
                  />

                  {/* Name text */}
                  <div
                    className="absolute left-1/2 top-1/2 origin-left"
                    style={{
                      transform: `rotate(${segmentAngle / 2}deg) translateX(180px)`,
                    }}
                  >
                    <p className="text-cyan-300 font-mono whitespace-nowrap -rotate-90 text-sm">
                      {participant.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-slate-900 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
            </div>
          </motion.div>

          {/* Neon ring segments */}
          <div className="absolute inset-0 rounded-full">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={isSpinning ? {
                  opacity: [0.3, 1, 0.3],
                } : {}}
                transition={{
                  duration: 0.3,
                  repeat: isSpinning ? Infinity : 0,
                  delay: i * 0.05,
                }}
                className="absolute w-2 h-8 bg-cyan-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${i * 30}deg) translate(300px, -4px)`,
                }}
              />
            ))}
          </div>

          {/* Energy particles when spinning */}
          {isSpinning && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 20) * 350,
                    y: Math.sin((i * Math.PI * 2) / 20) * 350,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                />
              ))}
            </>
          )}
        </div>

        {/* Spin button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSpin}
          disabled={isSpinning || participants.length === 0}
          className="mt-12 relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-mono text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isSpinning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
          <span className="relative z-10">
            {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
