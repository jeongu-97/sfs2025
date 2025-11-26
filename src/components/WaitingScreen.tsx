import { motion } from 'motion/react';
import { QrCode } from 'lucide-react';

export function WaitingScreen() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 font-mono tracking-wider">
          SFS 2025
        </h1>
        <p className="text-2xl text-cyan-300/80 font-mono">Smart Future Society</p>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* QR Code Area */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mx-auto w-96 h-96 mb-12"
      >
        {/* Glowing frame */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(6,182,212,0.3)',
              '0 0 40px rgba(6,182,212,0.5)',
              '0 0 20px rgba(6,182,212,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-cyan-400/50 rounded-2xl bg-slate-900/30 backdrop-blur-xl"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 -translate-x-1 -translate-y-1" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 -translate-x-1 translate-y-1" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 translate-x-1 translate-y-1" />
        </motion.div>

        {/* QR Code placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-64 h-64 bg-white rounded-xl flex items-center justify-center"
          >
            <QrCode className="w-56 h-56 text-slate-900" />
          </motion.div>
        </div>

        {/* Scanning line effect */}
        <motion.div
          animate={{ y: [0, 384, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              bottom: 0,
            }}
          />
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <p className="text-cyan-300/60 font-mono">Scan to participate in the lucky draw</p>
        
        {/* Data flow lines */}
        <div className="mt-8 relative h-20 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: [-100, 1000] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 2,
                ease: 'linear',
              }}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
              style={{
                top: `${i * 30 + 10}px`,
                width: '200px',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
