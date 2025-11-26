import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Zap, Microscope, Activity } from 'lucide-react';
import { Participant } from '../App';

interface DNAScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function DNAScreen({ participants, onDrawComplete }: DNAScreenProps) {
  const [isSequencing, setIsSequencing] = useState(false);
  const [helixRotation, setHelixRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [energyFlow, setEnergyFlow] = useState(0);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [winner, setWinner] = useState<Participant | null>(null);

  useEffect(() => {
    // DNA helix rotation animation
    const interval = setInterval(() => {
      setHelixRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSequencing) {
      // Energy flow animation
      const energyInterval = setInterval(() => {
        setEnergyFlow((prev) => (prev + 5) % 100);
      }, 50);

      // Sequence progress
      const progressInterval = setInterval(() => {
        setSequenceProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      return () => {
        clearInterval(energyInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isSequencing]);

  const startSequencing = () => {
    if (participants.length === 0 || isSequencing) return;
    
    setIsSequencing(true);
    setSelectedIndex(null);
    setSequenceProgress(0);
    setWinner(null);

    // Rapid gene scanning
    let scanCount = 0;
    const scanInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setSelectedIndex(randomIndex);
      scanCount++;

      if (scanCount > 30) {
        clearInterval(scanInterval);
      }
    }, 150);

    // DNA analysis complete
    setTimeout(() => {
      clearInterval(scanInterval);
      const winnerIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[winnerIndex];
      setSelectedIndex(winnerIndex);
      setWinner(selectedWinner);
      
      setTimeout(() => {
        setIsSequencing(false);
        onDrawComplete(selectedWinner.name);
      }, 3000);
    }, 6000);
  };

  // Create DNA strand pairs from participants
  const dnaStrands = participants.length > 0 
    ? Array.from({ length: Math.ceil(participants.length / 2) }, (_, i) => ({
        left: participants[i * 2],
        right: participants[i * 2 + 1] || participants[0],
        index: i,
      }))
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/80 backdrop-blur-xl rounded-full border border-cyan-500/50 mb-3">
          <Dna className="w-5 h-5 text-cyan-400" />
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-mono">
            DNA SEQUENCE LOTTERY
          </h2>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Microscope className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>
        <p className="text-cyan-300/60 font-mono">GENETIC RANDOMIZATION PROTOCOL</p>
      </motion.div>

      {/* Analysis status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'GENOME DATA', 
            value: participants.length.toString(),
            icon: <Activity className="w-4 h-4" />,
          },
          { 
            label: 'SEQUENCE', 
            value: isSequencing ? `${sequenceProgress}%` : 'READY',
            icon: <Dna className="w-4 h-4" />,
          },
          { 
            label: 'ENERGY', 
            value: isSequencing ? 'FLOWING' : 'STABLE',
            icon: <Zap className="w-4 h-4" />,
          },
          { 
            label: 'STATUS', 
            value: winner ? 'COMPLETE' : isSequencing ? 'ANALYZING' : 'STANDBY',
            icon: <Microscope className="w-4 h-4" />,
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-xl rounded-lg border border-purple-500/30 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-purple-400">{item.icon}</div>
              <p className="text-purple-400/60 font-mono text-sm">{item.label}</p>
            </div>
            <p className="text-purple-400 font-mono text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* DNA Helix Container */}
      <div className="relative aspect-[16/9] bg-slate-950/90 backdrop-blur-xl rounded-2xl border-2 border-purple-500/50 overflow-hidden mb-6 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
        {/* Laboratory grid background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="lab-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lab-grid)" />
          </svg>
        </div>

        {/* Energy particles background */}
        {isSequencing && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: '100%',
                  opacity: 0,
                }}
                animate={{ 
                  y: '-10%',
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'linear',
                }}
                className="absolute w-1 h-1 bg-purple-400 rounded-full blur-sm"
              />
            ))}
          </>
        )}

        {/* DNA Double Helix */}
        <div className="absolute inset-0 flex items-center justify-center perspective-1000">
          <div className="relative w-full h-full max-w-4xl">
            {dnaStrands.map((strand, strandIndex) => {
              const yPos = (strandIndex / dnaStrands.length) * 100;
              const angle = (helixRotation + strandIndex * 30) % 360;
              const leftX = Math.sin((angle * Math.PI) / 180) * 150;
              const rightX = Math.sin(((angle + 180) * Math.PI) / 180) * 150;
              const depth = Math.cos((angle * Math.PI) / 180);
              const isLeftSelected = selectedIndex === strandIndex * 2;
              const isRightSelected = selectedIndex === strandIndex * 2 + 1;
              const isWinnerStrand = winner && (
                winner.id === strand.left?.id || winner.id === strand.right?.id
              );

              return (
                <div
                  key={strandIndex}
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: `${yPos}%`,
                    zIndex: Math.floor(depth * 50 + 50),
                  }}
                >
                  {/* Left strand name */}
                  {strand.left && (
                    <motion.div
                      animate={{
                        x: leftX,
                        opacity: depth > 0 ? 1 : 0.3,
                        scale: isLeftSelected || isWinnerStrand ? 1.2 : 1,
                      }}
                      className="absolute whitespace-nowrap"
                      style={{ left: '-100px' }}
                    >
                      <div
                        className={`px-3 py-1 rounded-full border backdrop-blur-xl transition-all ${
                          isLeftSelected || (winner?.id === strand.left.id)
                            ? 'bg-pink-500/30 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                            : 'bg-cyan-500/10 border-cyan-400/50'
                        }`}
                      >
                        <p
                          className={`font-mono ${
                            isLeftSelected || (winner?.id === strand.left.id)
                              ? 'text-pink-300'
                              : 'text-cyan-300'
                          }`}
                        >
                          {strand.left.name}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Right strand name */}
                  {strand.right && (
                    <motion.div
                      animate={{
                        x: rightX,
                        opacity: depth < 0 ? 1 : 0.3,
                        scale: isRightSelected || isWinnerStrand ? 1.2 : 1,
                      }}
                      className="absolute whitespace-nowrap"
                      style={{ left: '100px' }}
                    >
                      <div
                        className={`px-3 py-1 rounded-full border backdrop-blur-xl transition-all ${
                          isRightSelected || (winner?.id === strand.right.id)
                            ? 'bg-pink-500/30 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                            : 'bg-purple-500/10 border-purple-400/50'
                        }`}
                      >
                        <p
                          className={`font-mono ${
                            isRightSelected || (winner?.id === strand.right.id)
                              ? 'text-pink-300'
                              : 'text-purple-300'
                          }`}
                        >
                          {strand.right.name}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Connecting base pair line */}
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width="400"
                    height="4"
                    style={{ opacity: Math.abs(depth) * 0.6 + 0.4 }}
                  >
                    <motion.line
                      x1={leftX + 200}
                      y1="2"
                      x2={rightX + 200}
                      y2="2"
                      stroke={isWinnerStrand ? '#ec4899' : '#a855f7'}
                      strokeWidth={isWinnerStrand ? '3' : '2'}
                      className={isWinnerStrand ? 'drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : ''}
                    />
                  </svg>

                  {/* Energy flow particles along base pair */}
                  {isSequencing && strandIndex === Math.floor(energyFlow / 10) % dnaStrands.length && (
                    <motion.div
                      initial={{ x: leftX }}
                      animate={{ x: rightX }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                    />
                  )}
                </div>
              );
            })}

            {/* Backbone strands */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="backbone-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Left backbone */}
              <motion.path
                d={dnaStrands.map((_, i) => {
                  const yPos = (i / dnaStrands.length) * 100;
                  const angle = (helixRotation + i * 30) % 360;
                  const x = Math.sin((angle * Math.PI) / 180) * 150 + 50;
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${yPos}%`;
                }).join(' ')}
                stroke="url(#backbone-gradient)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
              />
              
              {/* Right backbone */}
              <motion.path
                d={dnaStrands.map((_, i) => {
                  const yPos = (i / dnaStrands.length) * 100;
                  const angle = (helixRotation + i * 30 + 180) % 360;
                  const x = Math.sin((angle * Math.PI) / 180) * 150 + 50;
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${yPos}%`;
                }).join(' ')}
                stroke="url(#backbone-gradient)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Scanning overlay */}
        {isSequencing && (
          <motion.div
            animate={{ y: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 blur-sm"
          />
        )}

        {/* Winner highlight */}
        <AnimatePresence>
          {winner && !isSequencing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-purple-500/20 pointer-events-none"
            >
              {/* Energy burst */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-pink-400"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-purple-400" />
      </div>

      {/* Sequence progress */}
      {isSequencing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-purple-500/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-mono">DNA SEQUENCING...</span>
              <span className="text-purple-400 font-mono">{sequenceProgress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${sequenceProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 relative"
              >
                <motion.div
                  animate={{ x: [-20, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Winner display */}
      <AnimatePresence>
        {winner && !isSequencing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-xl rounded-lg border-2 border-pink-400/50 p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Dna className="w-6 h-6 text-pink-400" />
                <p className="text-pink-400 font-mono">GENETIC MATCH FOUND</p>
                <Dna className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-center">
                <p className="text-pink-300/60 font-mono mb-2">GENOME ID: {winner.id.padStart(8, '0')}</p>
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-mono"
                >
                  {winner.name}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSequencing}
          disabled={isSequencing || participants.length === 0}
          className="relative px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-mono text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isSequencing && (
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Dna className="w-5 h-5" />
            {isSequencing ? 'SEQUENCING DNA...' : 'START DNA SEQUENCE'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
