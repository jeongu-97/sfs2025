import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Check, Scan } from 'lucide-react';
import { Participant } from '../App';

interface DatabaseScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function DatabaseScreen({ participants, onDrawComplete }: DatabaseScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [isScanning]);

  const startScan = () => {
    if (participants.length === 0 || isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setSelectedId(null);

    // Random scanning effect through participants
    let scanCount = 0;
    const scanInterval = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setSelectedId(randomParticipant.id);
      scanCount++;

      if (scanCount > 20) {
        clearInterval(scanInterval);
      }
    }, 150);

    // Final selection after 5 seconds
    setTimeout(() => {
      clearInterval(scanInterval);
      const winner = participants[Math.floor(Math.random() * participants.length)];
      setSelectedId(winner.id);
      
      setTimeout(() => {
        setIsScanning(false);
        onDrawComplete(winner.name);
      }, 2000);
    }, 5000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/50 backdrop-blur-xl rounded-full border border-cyan-500/30 mb-4">
          <Scan className="w-5 h-5 text-cyan-400" />
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
            CITIZEN DATABASE
          </h2>
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
          >
            <Scan className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>
        <p className="text-cyan-300/60 font-mono">AI-Powered Selection System</p>
      </motion.div>

      {/* Scanning progress bar */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 max-w-2xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 font-mono">Scanning Database...</span>
                <span className="text-cyan-400 font-mono">{scanProgress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative"
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
      </AnimatePresence>

      {/* Holographic ID Cards Grid */}
      <div className="relative min-h-[500px] mb-8">
        {/* Scanning grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {isScanning && (
            <>
              {/* Horizontal scan lines */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute left-0 right-0 h-px bg-cyan-400"
                  style={{ top: `${i * 12.5}%` }}
                />
              ))}
              {/* Vertical scan lines */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`v-${i}`}
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="absolute top-0 bottom-0 w-px bg-cyan-400"
                  style={{ left: `${i * 16.66}%` }}
                />
              ))}
            </>
          )}
        </div>

        {/* ID Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {participants.map((participant, index) => {
            const isSelected = selectedId === participant.id;
            const isWinner = isSelected && !isScanning && scanProgress === 100;

            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: isWinner ? 1.1 : 1,
                  y: isScanning ? [0, -10, 0] : 0,
                  zIndex: isWinner ? 50 : 1,
                }}
                transition={{
                  delay: index * 0.05,
                  y: {
                    duration: 2,
                    repeat: isScanning ? Infinity : 0,
                    delay: index * 0.1,
                  },
                }}
                className={`relative ${isWinner ? 'col-span-2 row-span-2' : ''}`}
              >
                {/* Card glow */}
                {isSelected && (
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(6,182,212,0.5)',
                        '0 0 40px rgba(6,182,212,0.8)',
                        '0 0 20px rgba(6,182,212,0.5)',
                      ],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl"
                  />
                )}

                {/* Holographic card */}
                <div
                  className={`relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                      : 'border-cyan-500/30'
                  } ${isWinner ? 'p-8' : 'p-4'}`}
                >
                  {/* Holographic shimmer */}
                  <motion.div
                    animate={isSelected ? {
                      x: [-200, 200],
                    } : {}}
                    transition={{ duration: 1.5, repeat: isSelected ? Infinity : 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                  />

                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                  {/* Card content */}
                  <div className="relative z-10 space-y-3">
                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className={`rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 ${isWinner ? 'w-24 h-24' : 'w-16 h-16'}`}>
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                          <User className={`text-cyan-400 ${isWinner ? 'w-12 h-12' : 'w-8 h-8'}`} />
                        </div>
                      </div>
                    </div>

                    {/* ID Number */}
                    <div className="text-center">
                      <p className={`text-cyan-400/60 font-mono ${isWinner ? 'text-sm' : 'text-xs'}`}>
                        ID: {participant.id.padStart(6, '0')}
                      </p>
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <p className={`text-cyan-100 font-mono break-words ${isWinner ? 'text-2xl' : ''}`}>
                        {participant.name}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center justify-center gap-2">
                      {isWinner ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400"
                        >
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-mono">SELECTED</span>
                        </motion.div>
                      ) : (
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={isSelected ? {
                                opacity: [0.3, 1, 0.3],
                              } : {}}
                              transition={{
                                duration: 1,
                                repeat: isSelected ? Infinity : 0,
                                delay: i * 0.2,
                              }}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-cyan-400' : 'bg-cyan-400/30'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Winner badge */}
                    {isWinner && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center"
                      >
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-full border border-yellow-400">
                          <p className="text-yellow-400 font-mono">★ WINNER ★</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Scanning overlay */}
                  {isSelected && isScanning && (
                    <motion.div
                      animate={{ y: [0, 200] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-20 bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent pointer-events-none"
                    />
                  )}
                </div>

                {/* Particle effects for winner */}
                {isWinner && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 12) * 100,
                          y: Math.sin((i * Math.PI * 2) / 12) * 100,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {participants.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <User className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
              <p className="text-cyan-300/40 font-mono">No citizens in database</p>
            </div>
          </div>
        )}
      </div>

      {/* Control button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startScan}
          disabled={isScanning || participants.length === 0}
          className="relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-mono text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isScanning && (
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Scan className="w-5 h-5" />
            {isScanning ? 'SCANNING DATABASE...' : 'INITIATE AI SELECTION'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
