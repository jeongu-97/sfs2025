import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanFace, Eye, Brain, Shield, CheckCircle2 } from 'lucide-react';
import { Participant } from '../App';

interface FaceScanScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

export function FaceScanScreen({ participants, onDrawComplete }: FaceScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanTarget, setCurrentScanTarget] = useState<Participant | null>(null);
  const [scanningParticipants, setScanningParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [faceScanAngle, setFaceScanAngle] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);

  useEffect(() => {
    if (isScanning) {
      // Face scanning animation
      const angleInterval = setInterval(() => {
        setFaceScanAngle((prev) => (prev + 2) % 360);
      }, 30);

      // Progress simulation
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 0.8;
        });
      }, 50);

      return () => {
        clearInterval(angleInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isScanning]);

  const startFaceScan = () => {
    if (participants.length === 0 || isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setCurrentScanTarget(null);
    setWinner(null);
    setConfidenceLevel(0);
    setScanningParticipants([...participants]);

    // Rapid face scanning through participants
    let scanCount = 0;
    const scanInterval = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setCurrentScanTarget(randomParticipant);
      setConfidenceLevel(Math.floor(Math.random() * 30) + 50);
      scanCount++;

      if (scanCount > 25) {
        clearInterval(scanInterval);
      }
    }, 200);

    // AI decision phase
    setTimeout(() => {
      clearInterval(scanInterval);
      const selectedWinner = participants[Math.floor(Math.random() * participants.length)];
      setCurrentScanTarget(selectedWinner);
      
      // Build confidence
      let confidence = 70;
      const confidenceInterval = setInterval(() => {
        confidence += 5;
        setConfidenceLevel(Math.min(confidence, 100));
        if (confidence >= 100) {
          clearInterval(confidenceInterval);
          setWinner(selectedWinner);
          
          setTimeout(() => {
            setIsScanning(false);
            onDrawComplete(selectedWinner.name);
          }, 2500);
        }
      }, 150);
    }, 6000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/80 backdrop-blur-xl rounded-full border border-cyan-500/50 mb-3">
          <ScanFace className="w-5 h-5 text-cyan-400" />
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
            AI FACIAL RECOGNITION
          </h2>
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
          >
            <Brain className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>
        <p className="text-cyan-300/60 font-mono">NEURAL NETWORK SELECTION SYSTEM</p>
      </motion.div>

      {/* AI Status Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'SUBJECTS', value: participants.length.toString(), icon: <Eye className="w-4 h-4" /> },
          { label: 'CONFIDENCE', value: isScanning ? `${confidenceLevel}%` : '0%', icon: <Brain className="w-4 h-4" /> },
          { label: 'ANALYSIS', value: isScanning ? 'ACTIVE' : 'STANDBY', icon: <ScanFace className="w-4 h-4" /> },
          { label: 'SECURITY', value: 'VERIFIED', icon: <Shield className="w-4 h-4" /> },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-cyan-400">{item.icon}</div>
              <p className="text-cyan-400/60 font-mono text-sm">{item.label}</p>
            </div>
            <p className="text-cyan-400 font-mono text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main scanning interface */}
      <div className="relative aspect-[16/9] bg-slate-950/90 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/50 overflow-hidden mb-6 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Digital grid background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="face-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#face-grid)" />
          </svg>
        </div>

        {/* Holographic face in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Face outline */}
            <motion.div
              animate={isScanning ? {
                boxShadow: [
                  '0 0 30px rgba(6,182,212,0.3)',
                  '0 0 60px rgba(6,182,212,0.6)',
                  '0 0 30px rgba(6,182,212,0.3)',
                ],
              } : {}}
              transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
              className="relative w-64 h-80 rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-xl border-2 border-cyan-400/50"
            >
              {/* Face mesh lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250">
                {/* Vertical face mesh lines */}
                {[...Array(9)].map((_, i) => (
                  <motion.path
                    key={`v-${i}`}
                    d={`M ${20 + i * 20} 50 Q ${20 + i * 20} 125 ${20 + i * 20} 200`}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                    className="text-cyan-400/60"
                    animate={isScanning ? { opacity: [0.3, 0.8, 0.3] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
                
                {/* Horizontal face mesh lines */}
                {[...Array(8)].map((_, i) => (
                  <motion.ellipse
                    key={`h-${i}`}
                    cx="100"
                    cy={50 + i * 25}
                    rx={80 - Math.abs(i - 4) * 10}
                    ry="5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                    className="text-cyan-400/60"
                    animate={isScanning ? { opacity: [0.3, 0.8, 0.3] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}

                {/* Eyes */}
                <motion.circle
                  cx="75"
                  cy="100"
                  r="8"
                  fill="currentColor"
                  className="text-cyan-400"
                  animate={isScanning ? {
                    opacity: [0.5, 1, 0.5],
                    r: [8, 10, 8],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.circle
                  cx="125"
                  cy="100"
                  r="8"
                  fill="currentColor"
                  className="text-cyan-400"
                  animate={isScanning ? {
                    opacity: [0.5, 1, 0.5],
                    r: [8, 10, 8],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                {/* Nose line */}
                <motion.path
                  d="M 100 100 L 100 130"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-cyan-400/80"
                />

                {/* Mouth */}
                <motion.path
                  d="M 80 150 Q 100 160 120 150"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-cyan-400/80"
                />

                {/* Recognition points */}
                {[
                  [100, 60], [75, 100], [125, 100], [100, 120], [100, 150], 
                  [60, 110], [140, 110], [100, 180]
                ].map(([x, y], i) => (
                  <motion.circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="currentColor"
                    className="text-cyan-400"
                    animate={isScanning ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </svg>

              {/* Scanning line */}
              {isScanning && (
                <motion.div
                  animate={{ y: [0, 320, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
                />
              )}

              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

              {/* Rotating scan ring */}
              {isScanning && (
                <motion.div
                  animate={{ rotate: faceScanAngle }}
                  className="absolute inset-0 rounded-full"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-cyan-400" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-cyan-400" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-cyan-400" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-cyan-400" />
                </motion.div>
              )}
            </motion.div>

            {/* Current scan target display */}
            <AnimatePresence mode="wait">
              {currentScanTarget && (
                <motion.div
                  key={currentScanTarget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="px-6 py-2 bg-slate-900/90 backdrop-blur-xl rounded-lg border-2 border-cyan-400/50">
                    <p className="text-cyan-400 font-mono text-xl">{currentScanTarget.name}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Participant scanning grid */}
        <div className="absolute inset-0 p-8">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left column */}
            <div className="space-y-2 overflow-hidden">
              {scanningParticipants.slice(0, Math.ceil(scanningParticipants.length / 2)).map((participant, index) => {
                const isCurrentTarget = currentScanTarget?.id === participant.id;
                const isWinner = winner?.id === participant.id;

                return (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: isCurrentTarget || isWinner ? 1.05 : 1,
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative px-4 py-2 rounded border backdrop-blur-xl transition-all ${
                      isWinner
                        ? 'bg-green-500/20 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                        : isCurrentTarget
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/30 border-cyan-500/20'
                    }`}
                  >
                    {/* Scanning line effect */}
                    {isCurrentTarget && isScanning && !winner && (
                      <motion.div
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                      />
                    )}

                    <div className="relative flex items-center justify-between">
                      <p className={`font-mono ${
                        isWinner ? 'text-green-300' : isCurrentTarget ? 'text-cyan-300' : 'text-cyan-400/60'
                      }`}>
                        {participant.name}
                      </p>
                      
                      {isWinner && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      
                      {isCurrentTarget && !isWinner && isScanning && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2 overflow-hidden">
              {scanningParticipants.slice(Math.ceil(scanningParticipants.length / 2)).map((participant, index) => {
                const isCurrentTarget = currentScanTarget?.id === participant.id;
                const isWinner = winner?.id === participant.id;

                return (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: isCurrentTarget || isWinner ? 1.05 : 1,
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative px-4 py-2 rounded border backdrop-blur-xl transition-all ${
                      isWinner
                        ? 'bg-green-500/20 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                        : isCurrentTarget
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/30 border-cyan-500/20'
                    }`}
                  >
                    {/* Scanning line effect */}
                    {isCurrentTarget && isScanning && !winner && (
                      <motion.div
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                      />
                    )}

                    <div className="relative flex items-center justify-between">
                      <p className={`font-mono ${
                        isWinner ? 'text-green-300' : isCurrentTarget ? 'text-cyan-300' : 'text-cyan-400/60'
                      }`}>
                        {participant.name}
                      </p>
                      
                      {isWinner && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      
                      {isCurrentTarget && !isWinner && isScanning && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confidence meter */}
        <AnimatePresence>
          {isScanning && confidenceLevel > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96"
            >
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg border border-cyan-500/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-400 font-mono">CONFIDENCE LEVEL</span>
                  <span className="text-cyan-400 font-mono text-xl">{confidenceLevel}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidenceLevel}%` }}
                    className={`h-full relative ${
                      confidenceLevel >= 100 
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
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

        {/* Winner announcement */}
        <AnimatePresence>
          {winner && !isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/20 backdrop-blur-xl rounded-full border-2 border-green-400"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                  <p className="text-2xl text-green-400 font-mono">MATCH CONFIRMED</p>
                </motion.div>

                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono"
                >
                  {winner.name}
                </motion.p>

                <div className="space-y-2">
                  <p className="text-cyan-400/60 font-mono">SUBJECT ID: {winner.id.padStart(8, '0')}</p>
                  <p className="text-green-400 font-mono">CONFIDENCE: 100%</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan progress */}
      {isScanning && !winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-mono">AI NEURAL ANALYSIS</span>
              <span className="text-cyan-400 font-mono">{Math.floor(scanProgress)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
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

      {/* Control button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startFaceScan}
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
            <ScanFace className="w-5 h-5" />
            {isScanning ? 'SCANNING IN PROGRESS...' : 'INITIATE AI SCAN'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
