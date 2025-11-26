import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface WinnerScreenProps {
  winnerName: string;
  onReset: () => void;
}

export function WinnerScreen({ winnerName, onReset }: WinnerScreenProps) {
  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Spotlight effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
      />

      {/* Golden light burst */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 2,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/2 w-2 h-32 bg-gradient-to-t from-yellow-400 to-transparent"
          style={{
            transformOrigin: 'bottom',
            transform: `rotate(${i * 22.5}deg)`,
          }}
        />
      ))}

      {/* Fireworks particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 1, 0],
            x: (Math.random() - 0.5) * 800,
            y: -Math.random() * 400,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#fbbf24', '#f59e0b', '#06b6d4', '#3b82f6'][
              Math.floor(Math.random() * 4)
            ],
          }}
        />
      ))}

      <div className="relative z-10">
        {/* Congratulations title */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-yellow-500/20 backdrop-blur-xl rounded-full border border-yellow-400/50">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 font-mono">
              CONGRATULATIONS
            </h2>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        {/* Winner name */}
        <motion.div
          initial={{ scale: 0, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
          className="relative mb-12"
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(251,191,36,0.5)',
                '0 0 80px rgba(251,191,36,0.8)',
                '0 0 40px rgba(251,191,36,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-3xl blur-xl"
          />

          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-16 rounded-3xl border-2 border-yellow-400/50">
            <motion.p
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 font-mono"
            >
              {winnerName}
            </motion.p>
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-400" />
          <div className="absolute -top-4 -right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-400" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-400" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-400" />
        </motion.div>

        {/* Digital confetti */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-2xl text-cyan-300/80 font-mono mb-8">🎉 Winner Selected! 🎉</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-mono text-white"
          >
            Return to Start
          </motion.button>
        </motion.div>
      </div>

      {/* Background pulse animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full blur-3xl"
      />
    </div>
  );
}
