import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { Participant } from '../App';

interface HackerScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

const HACK_STAGES = [
  'INITIALIZING SYSTEM...',
  'CONNECTING TO DATABASE...',
  'BYPASSING FIREWALL...',
  'DECRYPTING DATA...',
  'ACCESSING PARTICIPANTS...',
  'RANDOMIZING SELECTION...',
  'FINALIZING TARGET...',
];

const MATRIX_CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function HackerScreen({ participants, onDrawComplete }: HackerScreenProps) {
  const [isHacking, setIsHacking] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '> SYSTEM READY',
    '> AWAITING COMMAND...',
  ]);
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [matrixColumns, setMatrixColumns] = useState<number[]>([]);

  useEffect(() => {
    // Initialize matrix rain columns
    const columns = Array.from({ length: 50 }, () => Math.random() * -1000);
    setMatrixColumns(columns);
  }, []);

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, line]);
  };

  const startHack = () => {
    if (participants.length === 0 || isHacking) return;
    
    setIsHacking(true);
    setAccessGranted(false);
    setWinner('');
    setCurrentStage(0);
    setTerminalLines([
      '> INITIALIZING HACK SEQUENCE...',
      '> [WARNING] UNAUTHORIZED ACCESS ATTEMPT',
    ]);

    // Simulate hacking stages
    HACK_STAGES.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(index);
        addTerminalLine(`> ${stage}`);
        
        // Add random "technical" output
        setTimeout(() => {
          addTerminalLine(`  [${Math.random().toString(16).substr(2, 8).toUpperCase()}] OK`);
        }, 200);
      }, index * 1000);
    });

    // Rapid cycling through participants
    let cycleCount = 0;
    const cycleInterval = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setCurrentTarget(randomParticipant.name);
      addTerminalLine(`  > SCANNING: ${randomParticipant.name.toUpperCase()}`);
      cycleCount++;

      if (cycleCount > 15) {
        clearInterval(cycleInterval);
      }
    }, 300);

    // Final selection
    setTimeout(() => {
      clearInterval(cycleInterval);
      const selectedWinner = participants[Math.floor(Math.random() * participants.length)];
      setWinner(selectedWinner.name);
      setCurrentTarget(selectedWinner.name);
      
      setTimeout(() => {
        addTerminalLine('> ');
        addTerminalLine('> ========================================');
        addTerminalLine('> ACCESS GRANTED');
        addTerminalLine('> ========================================');
        addTerminalLine(`> TARGET SELECTED: ${selectedWinner.name.toUpperCase()}`);
        addTerminalLine('> EXTRACTION COMPLETE');
        setAccessGranted(true);
        
        setTimeout(() => {
          setIsHacking(false);
          onDrawComplete(selectedWinner.name);
        }, 3000);
      }, 500);
    }, HACK_STAGES.length * 1000 + 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {matrixColumns.map((initialY, index) => (
          <motion.div
            key={index}
            initial={{ y: initialY }}
            animate={{ y: 1000 }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
            className="absolute text-green-400 font-mono opacity-60"
            style={{
              left: `${(index / 50) * 100}%`,
              fontSize: '14px',
            }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{ opacity: 1 - i * 0.05 }}>
                {MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Main terminal interface */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-xl rounded-lg border-2 border-green-500/50"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={isHacking ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: isHacking ? Infinity : 0, ease: 'linear' }}
            >
              <Terminal className="w-6 h-6 text-green-400" />
            </motion.div>
            <h2 className="text-2xl text-green-400 font-mono">
              {isHacking ? 'HACKING IN PROGRESS...' : 'TERMINAL v2.5.8'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isHacking ? (
              <Lock className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Unlock className="w-5 h-5 text-green-400" />
            )}
          </div>
        </motion.div>

        {/* Terminal screen */}
        <div className="bg-black/95 backdrop-blur-xl rounded-lg border-2 border-green-500/50 p-6 mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
          {/* Scanline effect */}
          <motion.div
            animate={{ y: [0, 600] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-green-400/20 to-transparent pointer-events-none"
          />

          {/* Terminal content */}
          <div className="space-y-1 h-96 overflow-y-auto font-mono text-green-400 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-black">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                className={`${line.includes('WARNING') ? 'text-red-400' : ''} ${
                  line.includes('ACCESS GRANTED') ? 'text-green-300 font-bold text-xl' : ''
                }`}
              >
                {line}
                {index === terminalLines.length - 1 && !accessGranted && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Glitch effect overlay */}
          {isHacking && Math.random() > 0.95 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-green-400/10"
            />
          )}
        </div>

        {/* Target display panel */}
        <AnimatePresence>
          {isHacking && currentTarget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 bg-black/95 backdrop-blur-xl rounded-lg border-2 border-green-500/50 p-8 relative overflow-hidden"
            >
              {/* Glitch borders */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <p className="text-yellow-400 font-mono">TARGET LOCKED</p>
                  <AlertTriangle className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>

                <motion.div
                  key={currentTarget}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className="relative"
                >
                  {/* Glitch effect on text */}
                  <motion.p
                    animate={accessGranted ? {} : {
                      x: [0, -2, 2, -2, 2, 0],
                      filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: isHacking && !accessGranted ? Infinity : 0,
                      repeatDelay: 2,
                    }}
                    className={`text-4xl font-mono ${
                      accessGranted ? 'text-green-300' : 'text-green-400'
                    }`}
                  >
                    {currentTarget.toUpperCase()}
                  </motion.p>

                  {/* Scanning lines */}
                  {!accessGranted && (
                    <>
                      <motion.div
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -bottom-2 left-0 right-0 h-px bg-green-400"
                      />
                      <motion.div
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute -top-2 left-0 right-0 h-px bg-green-400"
                      />
                    </>
                  )}
                </motion.div>

                {accessGranted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block px-6 py-2 bg-green-500/20 border border-green-400 rounded"
                  >
                    <p className="text-green-300 font-mono">✓ ACCESS GRANTED</p>
                  </motion.div>
                )}
              </div>

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-green-400" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-400" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-400" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-green-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        {isHacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-black/80 backdrop-blur-xl rounded-lg border border-green-500/50 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-mono">
                STAGE {currentStage + 1}/{HACK_STAGES.length}
              </span>
              <span className="text-green-400 font-mono">
                {Math.floor(((currentStage + 1) / HACK_STAGES.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-green-500/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStage + 1) / HACK_STAGES.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-green-400 relative"
              >
                <motion.div
                  animate={{ x: [-10, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* System status indicators */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'FIREWALL', status: isHacking && currentStage >= 2 ? 'BYPASSED' : 'ACTIVE' },
            { label: 'ENCRYPTION', status: isHacking && currentStage >= 3 ? 'CRACKED' : 'SECURED' },
            { label: 'DATABASE', status: isHacking && currentStage >= 4 ? 'ACCESSED' : 'LOCKED' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/80 backdrop-blur-xl rounded-lg border border-green-500/50 p-4"
            >
              <p className="text-green-400/60 font-mono mb-1">{item.label}</p>
              <p className={`font-mono ${
                item.status.includes('BYPASSED') || item.status.includes('CRACKED') || item.status.includes('ACCESSED')
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}>
                {item.status}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Execute button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34,197,94,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={startHack}
            disabled={isHacking || participants.length === 0}
            className="relative px-12 py-4 bg-green-500/20 backdrop-blur-xl rounded-lg border-2 border-green-400 font-mono text-green-400 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              {isHacking ? 'EXECUTING...' : '> EXECUTE HACK'}
            </span>
            <motion.div
              animate={isHacking ? { x: [-200, 200] } : {}}
              transition={{ duration: 1, repeat: isHacking ? Infinity : 0, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
            />
            {!isHacking && (
              <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/10 transition-colors" />
            )}
          </motion.button>
        </div>

        {/* Participants count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-green-400/60 font-mono">
            TARGETS IN DATABASE: {participants.length}
          </p>
        </motion.div>
      </div>

      {/* Screen flicker effect */}
      {isHacking && Math.random() > 0.98 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 bg-green-400 pointer-events-none mix-blend-screen"
        />
      )}
    </div>
  );
}
